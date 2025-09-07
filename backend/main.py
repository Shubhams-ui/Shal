from fastapi import FastAPI, Query, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests
origins = [
    "http://localhost:5173",
    "https://cloe-frontend.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Predefined 50 research topics with descriptions
research_topics = {
    "Artificial Intelligence in Healthcare": "AI applications in diagnosis, treatment planning, and patient care.",
    "Quantum Computing Applications": "Quantum algorithms and their use in cryptography and simulations.",
    "Blockchain Technology in Finance": "Secure transactions and smart contracts in financial systems.",
    "Machine Learning for Climate Change": "ML models to predict climate trends and reduce emissions.",
    "Renewable Energy Solutions": "Research on solar, wind, hydro, and sustainable energy.",
    "Cybersecurity Threats and Solutions": "Study of cyber attacks and techniques to protect systems.",
    "Autonomous Vehicles and Safety": "Self-driving cars and technologies to ensure road safety.",
    "Deep Learning for Image Recognition": "Neural networks for image classification and detection.",
    "IoT in Smart Cities": "Integration of IoT devices to improve urban infrastructure.",
    "Augmented Reality in Education": "AR technologies for interactive and immersive learning.",
    "Natural Language Processing Advances": "Techniques for understanding and processing human language.",
    "Data Privacy and Ethics": "Protecting personal data and ethical considerations in AI.",
    "5G Network Applications": "Applications and benefits of 5G connectivity in various sectors.",
    "Robotics in Manufacturing": "Automation of production lines using robots and AI.",
    "Genomics and Personalized Medicine": "Studying genes to tailor treatments to individuals.",
    "Virtual Reality in Therapy": "VR tools for mental health and rehabilitation.",
    "Sustainable Agriculture Techniques": "Eco-friendly methods for improving crop production.",
    "Edge Computing Innovations": "Processing data closer to the source for efficiency and speed.",
    "Human-Computer Interaction Trends": "Improving usability and user experience in software systems.",
    "AI in Drug Discovery": "Accelerating drug development using artificial intelligence.",
    "Smart Home Automation": "Intelligent systems for home control and energy savings.",
    "Wearable Technology for Health Monitoring": "Devices to monitor health metrics in real time.",
    "Big Data Analytics in Business": "Using large datasets to inform business decisions.",
    "Computer Vision in Security Systems": "Image and video analysis for surveillance and safety.",
    "AI-driven Financial Forecasting": "Predicting market trends using machine learning models.",
    "Nanotechnology in Medicine": "Tiny technologies for diagnosis and targeted treatment.",
    "Renewable Energy Storage Solutions": "Efficient storage systems for solar and wind energy.",
    "Autonomous Drones for Delivery": "Drone-based systems for package delivery and logistics.",
    "AI in Sports Analytics": "Using AI to improve performance analysis in sports.",
    "Digital Twin Technology": "Creating virtual models of physical systems for analysis.",
    "Smart Grid Systems": "Intelligent electricity networks for efficiency and reliability.",
    "Voice Recognition and Assistants": "Speech processing technologies for virtual assistants.",
    "AI in Legal Research": "Automating legal document analysis and case prediction.",
    "Cyber-Physical Systems": "Integration of computing and physical processes for smart systems.",
    "Self-healing Materials": "Materials that repair themselves when damaged.",
    "Predictive Maintenance in Industry": "Using sensors and AI to predict equipment failures.",
    "Machine Learning in Retail": "Improving sales and customer experience using ML models.",
    "AI in Mental Health Diagnosis": "Tools for detecting and monitoring mental health conditions.",
    "Blockchain in Supply Chain Management": "Tracking goods securely and transparently using blockchain.",
    "Smart Transportation Systems": "AI-enabled traffic management and route optimization.",
    "Deepfake Detection Technology": "Identifying manipulated videos and images.",
    "AI in Agricultural Monitoring": "Monitoring crops and soil using AI-powered sensors.",
    "Ethical AI Frameworks": "Guidelines and policies for responsible AI usage.",
    "Computer-aided Drug Design": "Using computers to design new chemical compounds.",
    "Environmental Monitoring using Sensors": "Tracking environmental conditions with IoT sensors.",
    "AI for Disaster Response": "Predicting and managing natural disasters using AI.",
    "Genetic Algorithms in Optimization": "Algorithms inspired by evolution for solving complex problems.",
    "AI-driven Content Generation": "Generating text, images, or music with AI models.",
    "Brain-Computer Interfaces": "Direct communication between brain and computers.",
    "Renewable Microgrids": "Localized energy networks using renewable sources.",
    "Swarm Robotics Applications": "Coordination of multiple robots to perform tasks efficiently."
}

# Define your API key
API_KEY = "AIzaSyCYSJXf09RObgZ7zcnD4Ovv_pfC2fl-uwc"

# Helper function to validate API key
def validate_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")

# Endpoints

@app.get("/")
def root():
    return {"message": "Backend is live and serving 50 research topics!"}

@app.get("/search")
def search_topic(q: str = Query(..., description="Topic to search for"), x_api_key: str = Header(...)):
    validate_api_key(x_api_key)
    
    topic = research_topics.get(q)
    if topic:
        return {"topic": q, "description": topic}
    else:
        suggestions = [t for t in research_topics.keys() if q.lower() in t.lower()]
        return {"error": f"No description found for '{q}'", "suggestions": suggestions}

@app.get("/summarize")
def summarize_topic(topic: str = Query(..., description="Topic to summarize"), x_api_key: str = Header(...)):
    validate_api_key(x_api_key)
    
    description = research_topics.get(topic)
    if description:
        return {"topic": topic, "summary": description}
    else:
        suggestions = [t for t in research_topics.keys() if topic.lower() in t.lower()]
        return {"error": f"No summary found for '{topic}'", "suggestions": suggestions}

@app.get("/all")
def get_all_topics(x_api_key: str = Header(...)):
    validate_api_key(x_api_key)
    return {"topics": list(research_topics.keys())}
