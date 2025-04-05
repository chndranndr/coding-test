# Sales Dashboard Documentation

## Project Overview

This project is a simple full-stack application that displays sales data in a user-friendly dashboard. It consists of:

- **Frontend**: A Next.js application that renders sales representatives' data
- **Backend**: A FastAPI server that provides REST endpoints and optional AI functionality
- **Data**: JSON-based sales information with nested structures

## Architecture

### Frontend (Next.js)

The frontend is built with Next.js and features:

- Single-page application design with responsive UI
- Asynchronous data fetching from the backend API
- Interactive components for viewing sales representative details
- Optional AI query interface for asking questions about the data

### Backend (FastAPI)

The backend is powered by FastAPI and provides:

- REST API endpoints for serving sales data
- CORS middleware configuration for cross-origin requests
- Optional AI integration with Google's Gemini API

## Setup Instructions

### Prerequisites

- Python 3.8+ for the backend
- Node.js 14+ for the frontend
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. If using the AI feature, set up the Gemini API key:
   - Get an API key from [Google AI Studio](https://ai.google.dev/)
   - Set the environment variable:
     ```bash
     # Windows
     set GEMINI_API_KEY=your_api_key_here
     
     # macOS/Linux
     export GEMINI_API_KEY=your_api_key_here
     ```

5. Run the server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

6. Verify the API is working by visiting:
   - API documentation: http://localhost:8000/docs
   - Sales data endpoint: http://localhost:8000/api/sales-reps

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## API Endpoints

### GET /api/sales-reps

Returns the complete sales representatives data from the JSON file.

**Response format:**
```json
{
  "salesReps": [
    {
      "id": 1,
      "name": "Alice",
      "role": "Senior Sales Executive",
      "region": "North America",
      "skills": ["Negotiation", "CRM", "Client Relations"],
      "deals": [...],
      "clients": [...]
    },
    ...
  ]
}
```

### POST /api/ai

Accepts a question about the sales data and returns an AI-generated response.

**Request format:**
```json
{
  "question": "Who is the top performing sales rep?"
}
```

**Response format:**
```json
{
  "answer": "Based on the data, Alice has the highest value closed deal at $120,000 with Acme Corp..."
}
```

## Design Choices

### Why This Architecture?

The architecture of this project was carefully designed to balance modern development practices, performance, and developer experience. Here's why we made these choices:

### Frontend Design (Next.js)

We chose Next.js for the frontend for several compelling reasons:

1. **Component Structure**
   - Single page application with conditional rendering for different views
   - Separation of concerns between data fetching, display, and user interaction
   - **Why?** This structure promotes code reusability, maintainability, and a clear separation of responsibilities, making the codebase easier to understand and extend.

2. **UI/UX Considerations**
   - Mobile-first responsive design
   - Loading states to provide feedback during data fetching
   - Error handling with user-friendly messages
   - Interactive elements for exploring nested data structures
   - **Why?** These considerations ensure a smooth user experience across all devices and network conditions, increasing user engagement and satisfaction.

3. **Next.js Benefits**
   - **Server-side rendering** capabilities improve initial load performance and SEO
   - **Built-in API routes** simplify backend integration
   - **Automatic code splitting** reduces initial bundle size
   - **Hot module replacement** enhances developer experience
   - **Strong TypeScript support** improves code quality and developer productivity

### Backend Design (FastAPI)

FastAPI was selected as our backend framework for these key reasons:

1. **API Architecture**
   - RESTful endpoints following standard conventions
   - CORS configuration to allow frontend access
   - Automatic API documentation with FastAPI's built-in Swagger UI
   - **Why?** This architecture provides a clean, standardized interface for the frontend to consume, with built-in documentation that simplifies development and testing.

2. **FastAPI Advantages**
   - **High performance** - one of the fastest Python frameworks available
   - **Automatic validation** of request and response data
   - **Built-in async support** for handling concurrent requests efficiently
   - **Minimal boilerplate code** compared to alternatives like Flask or Django
   - **Modern Python features** utilizing type hints and Pydantic models

3. **AI Integration**
   - Gemini API integration for natural language processing
   - Context-aware prompts that include sales data information
   - Error handling for cases when the API key is not configured
   - **Why?** This integration adds intelligent capabilities to the dashboard without requiring extensive AI expertise or infrastructure. Gemini offers free access to a wide range of models, making it a suitable choice for our AI needs.

### Data Management

1. **Data Structure**
   - Nested JSON format to represent hierarchical relationships
   - Organized by sales representatives with related deals and clients

2. **Data Flow**
   - Backend reads from static JSON file
   - Frontend fetches and caches data for efficient rendering
   - Selected data is passed to child components as needed
   - **Why?** This approach minimizes unnecessary data transfers, reduces component coupling, and improves application performance by only passing required data to each component.

### Why Google's Gemini API?

The choice to integrate Google's Gemini API for the AI functionality was deliberate and based on several factors:

1. **Advanced Natural Language Understanding**
   - Gemini offers superior comprehension of complex, context-heavy questions about sales data
   - Capable of understanding industry-specific terminology and nuanced queries
   - Provides more natural, human-like responses compared to simpler language models
   - Free API access for testing and development with certain usage limits.

2. **Technical Advantages**
   - **Context window** - can process the entire sales dataset in a single prompt
   - **Low latency** - provides quick responses essential for interactive Q&A features

3. **Integration Simplicity**
   - Clean, well-documented Python SDK that integrates seamlessly with FastAPI
   - Straightforward authentication using API keys
   - Minimal code required to implement powerful AI features

4. **Alternatives Considered**
   - **OpenAI GPT models** - Comparable capabilities but higher costs for similar performance
   - **Open-source models** - Would require significant infrastructure and expertise to deploy and maintain
   - **Custom ML solutions** - Would require extensive development time and specialized knowledge

## Potential Improvements

### Frontend Enhancements

1. **Advanced Visualization**
   - Add charts and graphs to visualize sales performance
   - Implement filtering and sorting capabilities
   - Add pagination for handling larger datasets

2. **User Experience**
   - Implement dark/light mode toggle
   - Add animations for smoother transitions
   - Improve mobile experience with touch-optimized controls

### Backend Enhancements

1. **Data Management**
   - Implement a database instead of static JSON
   - Add CRUD operations for managing sales data
   - Implement data validation and sanitization

2. **API Features**
   - Add authentication and authorization
   - Implement rate limiting for API endpoints
   - Add caching for improved performance

### AI Capabilities

1. **Enhanced Intelligence**
   - Train a custom model on sales-specific terminology
   - Implement predictive analytics for sales forecasting
   - Add sentiment analysis for client interactions

2. **User Interaction**
   - Implement a chat-like interface for more natural interaction
   - Add voice input capabilities
   - Provide suggested questions based on available data

## Troubleshooting

### Common Issues

1. **Backend Connection Errors**
   - Ensure the FastAPI server is running on port 8000
   - Check CORS configuration if you're getting cross-origin errors
   - Verify the path to dummyData.json is correct

2. **Frontend Rendering Issues**
   - Check browser console for JavaScript errors
   - Ensure Next.js development server is running on port 3000
   - Clear browser cache if you're seeing outdated data

3. **AI Feature Not Working**
   - Verify the GEMINI_API_KEY environment variable is set correctly
   - Check network requests for API errors
   - Ensure questions are related to the available sales data