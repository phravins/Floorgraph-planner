from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import time
import random
import requests
from datetime import datetime
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Enhanced logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
UPLOAD_FOLDER = 'generated_plans'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Mock AI service - Replace this with your actual AI service
def generate_floor_plan_with_ai(data):
    """
    Replace this function with your actual AI floor plan generation logic.
    This is a mock implementation that simulates AI processing.
    """
    try:
        logger.info(f"Starting AI generation for: {data.get('sqft')} sqft")
        
        # Simulate AI processing time
        time.sleep(2)
        
        # Mock response - replace with actual AI service call
        # Example of how you might call an actual AI service:
        # response = requests.post('YOUR_AI_SERVICE_URL', json=data, timeout=30)
        # return response.json()
        
        # For now, return a mock success response
        mock_image_url = "https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=AI+Generated+Floor+Plan"
        
        result = {
            "success": True,
            "image_url": mock_image_url,
            "message": "Floor plan generated successfully",
            "generation_time": "2 seconds",
            "request_id": f"req_{int(time.time())}"
        }
        
        logger.info("AI generation completed successfully")
        return result
        
    except requests.RequestException as e:
        logger.error(f"AI service request failed: {str(e)}")
        return {
            "success": False,
            "error": f"AI service unavailable: {str(e)}"
        }
    except Exception as e:
        logger.error(f"AI generation failed: {str(e)}")
        return {
            "success": False,
            "error": f"AI generation failed: {str(e)}"
        }

@app.route('/')
def index():
    """Serve the main application"""
    try:
        return send_from_directory('dist', 'index.html')
    except FileNotFoundError:
        return jsonify({
            "error": "Frontend not found. Please build the frontend first."
        }), 404

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files from the dist directory"""
    try:
        return send_from_directory('dist', path)
    except FileNotFoundError:
        return jsonify({
            "error": f"File not found: {path}"
        }), 404

@app.route('/generate-floorplan', methods=['POST', 'OPTIONS'])
def generate_floorplan():
    """Generate floor plan using AI based on user input"""
    # Handle preflight requests
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            logger.warning("No data provided in request")
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
        
        # Validate required fields - FIXED: Check for proper field names
        required_fields = ['sqft', 'depth', 'width']
        missing_fields = []
        
        for field in required_fields:
            if field not in data:
                missing_fields.append(field)
            elif not data[field] or (isinstance(data[field], str) and not data[field].strip()):
                missing_fields.append(field)
        
        if missing_fields:
            logger.warning(f"Missing required fields: {missing_fields}")
            return jsonify({
                "success": False,
                "error": f"Missing required fields: {', '.join(missing_fields)}. Please provide sqft, depth, and width."
            }), 400
        
        # Additional validation - FIXED: Better type checking
        try:
            sqft = float(data['sqft'])
            depth = float(data['depth'])
            width = float(data['width'])
            
            if sqft <= 0 or depth <= 0 or width <= 0:
                raise ValueError("Values must be positive")
                
        except (ValueError, TypeError) as e:
            logger.warning(f"Invalid numeric values: {e}")
            return jsonify({
                "success": False,
                "error": "Invalid numeric values. Please provide positive numbers for sqft, depth, and width."
            }), 400
        
        # Log the received data for debugging
        logger.info(f"Received floor plan request: {json.dumps(data, indent=2)}")
        
        # Process the data and generate floor plan
        result = generate_floor_plan_with_ai(data)
        
        # Log the result
        logger.info(f"AI generation result: {result.get('success', False)}")
        
        # Save request data for future reference
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            request_file = os.path.join(app.config['UPLOAD_FOLDER'], f'request_{timestamp}.json')
            
            with open(request_file, 'w') as f:
                json.dump({
                    'timestamp': timestamp,
                    'request_data': data,
                    'result': result
                }, f, indent=2)
        except Exception as save_error:
            logger.warning(f"Could not save request data: {save_error}")
        
        return jsonify(result)
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON in request")
        return jsonify({
            "success": False,
            "error": "Invalid JSON format"
        }), 400
        
    except Exception as e:
        error_message = f"Server error: {str(e)}"
        logger.error(f"Error in generate_floorplan: {error_message}")
        
        return jsonify({
            "success": False,
            "error": error_message
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "AI Floor Plan Generator",
        "version": "1.0.0"
    })

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Test endpoint to verify API is working"""
    return jsonify({
        "message": "Flask backend is working!",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "health": "/health",
            "test": "/api/test",
            "generate": "/generate-floorplan"
        }
    })

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Available endpoints:")
    print("  GET  /health - Health check")
    print("  GET  /api/test - Test endpoint")
    print("  POST /generate-floorplan - Generate floor plan")
    print("  GET  / - Serve frontend application")
    
    # Get configuration from environment
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    host = os.environ.get('HOST', '0.0.0.0')
    
    logger.info(f"Starting server on {host}:{port} (debug={debug_mode})")
    
    # Run the Flask app
    app.run(
        host=host,
        port=port,
        debug=debug_mode,
        threaded=True
    )