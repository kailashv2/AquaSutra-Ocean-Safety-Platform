import os
import json
import re
import time
import random
from datetime import datetime, timedelta
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# Download required NLTK resources
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('vader_lexicon', quiet=True)

# Database connection
def get_db_connection():
    """Connect to the PostgreSQL database"""
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        database=os.environ.get('DB_NAME', 'aquasutra'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASSWORD', 'postgres')
    )
    return conn

# Hazard keywords and related terms
HAZARD_KEYWORDS = {
    'flood': ['flood', 'flooding', 'inundation', 'submerged', 'water level', 'rising water'],
    'tsunami': ['tsunami', 'tidal wave', 'seismic sea wave', 'harbor wave'],
    'high_waves': ['high waves', 'storm surge', 'rough sea', 'dangerous waves', 'sea state'],
    'coastal_damage': ['coastal damage', 'erosion', 'coastal erosion', 'shore damage', 'beach damage']
}

# Locations for demo (can be expanded)
LOCATIONS = [
    {'name': 'Chennai', 'lat': 13.0827, 'lng': 80.2707},
    {'name': 'Mumbai', 'lat': 19.0760, 'lng': 72.8777},
    {'name': 'Kochi', 'lat': 9.9312, 'lng': 76.2673},
    {'name': 'Visakhapatnam', 'lat': 17.6868, 'lng': 83.2185},
    {'name': 'Puducherry', 'lat': 11.9416, 'lng': 79.8083}
]

class SocialMediaAnalyzer:
    def __init__(self):
        """Initialize the analyzer with sentiment analyzer and stopwords"""
        self.sia = SentimentIntensityAnalyzer()
        self.stop_words = set(stopwords.words('english'))
        
        # Add custom stopwords
        self.stop_words.update(['rt', 'http', 'https', 'amp', 'the', 'a', 'an', 'in', 'on', 'at'])
        
    def fetch_social_data(self, simulate=True):
        """
        Fetch social media data from APIs or simulate data
        
        Args:
            simulate (bool): Whether to simulate data instead of using real APIs
            
        Returns:
            list: List of social media posts
        """
        if simulate:
            return self._simulate_social_data()
        else:
            # Implement real API calls here (Twitter, YouTube, etc.)
            # This would require API keys and proper authentication
            raise NotImplementedError("Real API integration not implemented")
    
    def _simulate_social_data(self, count=50):
        """
        Simulate social media data for demo purposes
        
        Args:
            count (int): Number of posts to simulate
            
        Returns:
            list: List of simulated social media posts
        """
        sources = ['twitter', 'facebook', 'instagram', 'news']
        
        # Templates for generating realistic posts
        templates = [
            "Seeing {hazard} in {location} area. Stay safe everyone! #{hazard_tag} #emergency",
            "Alert: {hazard} reported near {location}. Authorities responding. #{hazard_tag}",
            "Just witnessed {hazard} at {location} beach. Scary situation! #{hazard_tag} #warning",
            "{hazard} situation worsening in {location}. Need immediate help! #{hazard_tag}",
            "Update: {hazard} conditions improving in {location} after emergency response. #{hazard_tag}",
            "Breaking: {hazard} warning issued for {location} coastal areas. Take precautions! #{hazard_tag}",
            "My neighborhood in {location} is affected by {hazard}. Roads blocked. #{hazard_tag}",
            "Government officials monitoring {hazard} situation in {location}. Stay tuned for updates. #{hazard_tag}",
            "Relief efforts underway for {hazard} victims in {location}. #{hazard_tag} #relief",
            "Volunteers needed to help with {hazard} aftermath in {location}. #{hazard_tag} #volunteer"
        ]
        
        posts = []
        now = datetime.now()
        
        for _ in range(count):
            # Select random hazard type and location
            hazard_type = random.choice(list(HAZARD_KEYWORDS.keys()))
            hazard_terms = HAZARD_KEYWORDS[hazard_type]
            hazard_term = random.choice(hazard_terms)
            location = random.choice(LOCATIONS)
            
            # Create post with random template
            template = random.choice(templates)
            text = template.format(
                hazard=hazard_term.title(),
                location=location['name'],
                hazard_tag=hazard_type.replace('_', '')
            )
            
            # Random timestamp within last 24 hours
            random_minutes = random.randint(0, 1440)  # Up to 24 hours
            timestamp = now - timedelta(minutes=random_minutes)
            
            # Create post object
            post = {
                'id': f"sim_{int(time.time())}_{random.randint(1000, 9999)}",
                'source': random.choice(sources),
                'text': text,
                'created_at': timestamp.isoformat(),
                'location': {
                    'name': location['name'],
                    'lat': location['lat'] + random.uniform(-0.05, 0.05),  # Add some randomness
                    'lng': location['lng'] + random.uniform(-0.05, 0.05)
                }
            }
            
            posts.append(post)
        
        return posts
    
    def analyze_text(self, text):
        """
        Analyze text for hazard keywords and sentiment
        
        Args:
            text (str): Text to analyze
            
        Returns:
            dict: Analysis results with keywords and sentiment
        """
        # Tokenize and clean text
        text = text.lower()
        tokens = word_tokenize(text)
        tokens = [token for token in tokens if token.isalpha() and token not in self.stop_words]
        
        # Extract hazard keywords
        found_keywords = []
        hazard_type = None
        
        for keyword_type, keywords in HAZARD_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text or any(kw in tokens for kw in keyword.split()):
                    found_keywords.append(keyword)
                    hazard_type = keyword_type
                    break
            if hazard_type:
                break
        
        # Perform sentiment analysis
        sentiment_scores = self.sia.polarity_scores(text)
        
        # Determine sentiment category
        compound_score = sentiment_scores['compound']
        if compound_score >= 0.05:
            sentiment = 'positive'
        elif compound_score <= -0.05:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return {
            'keywords': found_keywords,
            'hazard_type': hazard_type,
            'sentiment': sentiment,
            'sentiment_score': compound_score
        }
    
    def process_social_data(self, posts):
        """
        Process a batch of social media posts
        
        Args:
            posts (list): List of social media posts
            
        Returns:
            tuple: (processed_posts, analytics_data)
        """
        processed_posts = []
        keyword_counts = {}
        sentiment_counts = {'positive': 0, 'neutral': 0, 'negative': 0}
        hazard_counts = {k: 0 for k in HAZARD_KEYWORDS.keys()}
        
        for post in posts:
            # Analyze post text
            analysis = self.analyze_text(post['text'])
            
            # Skip posts without hazard keywords
            if not analysis['keywords']:
                continue
            
            # Update keyword counts
            for keyword in analysis['keywords']:
                if keyword in keyword_counts:
                    keyword_counts[keyword] += 1
                else:
                    keyword_counts[keyword] = 1
            
            # Update sentiment counts
            sentiment_counts[analysis['sentiment']] += 1
            
            # Update hazard type counts
            if analysis['hazard_type']:
                hazard_counts[analysis['hazard_type']] += 1
            
            # Add analysis to post
            processed_post = {
                **post,
                'analysis': analysis
            }
            
            processed_posts.append(processed_post)
        
        # Prepare analytics data
        analytics_data = {
            'keyword_counts': [{'keyword': k, 'count': v} for k, v in keyword_counts.items()],
            'sentiment_counts': [{'sentiment': k, 'count': v} for k, v in sentiment_counts.items()],
            'hazard_counts': [{'hazard_type': k, 'count': v} for k, v in hazard_counts.items()],
            'timestamp': datetime.now().isoformat()
        }
        
        return processed_posts, analytics_data
    
    def save_to_database(self, processed_posts, analytics_data):
        """
        Save processed data to database
        
        Args:
            processed_posts (list): Processed social media posts
            analytics_data (dict): Analytics data
            
        Returns:
            bool: Success status
        """
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Save NLP analytics data
            for keyword_data in analytics_data['keyword_counts']:
                cursor.execute(
                    """
                    INSERT INTO nlp_analytics (keyword, sentiment, count, timestamp)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (
                        keyword_data['keyword'],
                        'mixed',  # Aggregate sentiment
                        keyword_data['count'],
                        datetime.now()
                    )
                )
            
            # Save individual post analytics
            for post in processed_posts:
                if 'location' in post and post['analysis']['hazard_type']:
                    cursor.execute(
                        """
                        INSERT INTO social_posts (source_id, source_type, text, keywords, 
                                                 sentiment, hazard_type, location, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)
                        """,
                        (
                            post['id'],
                            post['source'],
                            post['text'],
                            json.dumps(post['analysis']['keywords']),
                            post['analysis']['sentiment'],
                            post['analysis']['hazard_type'],
                            post['location']['lng'],
                            post['location']['lat'],
                            post['created_at']
                        )
                    )
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            print(f"Database error: {e}")
            if conn:
                conn.rollback()
                conn.close()
            return False
    
    def export_to_json(self, processed_posts, analytics_data, output_file='nlp_output.json'):
        """
        Export processed data to JSON file
        
        Args:
            processed_posts (list): Processed social media posts
            analytics_data (dict): Analytics data
            output_file (str): Output file path
            
        Returns:
            str: Output file path
        """
        output_data = {
            'posts': processed_posts,
            'analytics': analytics_data
        }
        
        with open(output_file, 'w') as f:
            json.dump(output_data, f, indent=2)
        
        return output_file

def main():
    """Main function to run the social media analyzer"""
    analyzer = SocialMediaAnalyzer()
    
    # Fetch/simulate social media data
    posts = analyzer.fetch_social_data(simulate=True)
    
    # Process the data
    processed_posts, analytics_data = analyzer.process_social_data(posts)
    
    # Save to database
    analyzer.save_to_database(processed_posts, analytics_data)
    
    # Export to JSON
    output_file = analyzer.export_to_json(processed_posts, analytics_data)
    print(f"Analysis complete. Output saved to {output_file}")

if __name__ == "__main__":
    main()