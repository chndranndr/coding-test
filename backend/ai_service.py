import os
import json
from pathlib import Path
import google.genai as genai
from google.genai import types

# Load dummy data
data_file = Path("dummyData.json")
if not data_file.exists():
    data_file = Path("../dummyData.json")

with open(data_file, "r") as f:
    SALES_DATA = json.load(f)

class GeminiAIService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("Warning: No Gemini API key provided. Set GEMINI_API_KEY environment variable or pass it to the constructor.")
        
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Error initializing Gemini model: {e}")
    
    def process_query(self, query):
        if not self.api_key or not self.client:
            return {"answer": "Gemini API key not configured. Please set the GEMINI_API_KEY environment variable."}
        
        try:
            prompt = self._create_prompt(query)
            
            response = self.client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[
                        types.Tool(
                            google_search=types.GoogleSearch()
                        )
                    ]
                )
            )
            
            # Extract text from response
            if hasattr(response, 'text'):
                answer_text = response.text
            elif hasattr(response, 'candidates') and response.candidates:
                if response.candidates and len(response.candidates) > 0:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'content') and candidate.content is not None:
                        if hasattr(candidate.content, 'parts'):
                            parts = candidate.content.parts
                            if parts and len(parts) > 0:
                                answer_text = parts[0].text
                            else:
                                answer_text = "No text content found in response"
                        else:
                            answer_text = "Response content has no parts attribute"
                    else:
                        answer_text = "Invalid response structure"
                else:
                    answer_text = "No candidates found in response"
            else:
                answer_text = str(response)
                
            return {"answer": answer_text}
        except Exception as e:
            return {"answer": f"Error processing query with Gemini API: {str(e)}"}
    
    def _create_prompt(self, query):
        data_context = self._get_data_context()
        
        # Construct the full prompt
        prompt = f"""
        You are an AI assistant that helps analyze sales data.
        Answer the following question based on the complete sales data provided below:
        
        {data_context}
        
        User question: {query}
        
        Provide a concise and helpful answer based only on the data provided. 
        You have access to the complete JSON data, so use all relevant information to provide accurate and detailed responses. 
        If the question cannot be answered with the available data, politely explain what information is missing.
        
        Format your response using markdown for better readability:
        - Use **bold** for emphasis and important numbers
        - Use headings (## and ###) for sections
        - Use bullet points or numbered lists where appropriate
        - Use code blocks for JSON examples if needed
        - Use tables when comparing multiple data points
        """
        
        return prompt
    
    def _get_data_context(self):
        context = "Complete sales data in JSON format:\n"
        context += json.dumps(SALES_DATA, indent=2)
        
        return context