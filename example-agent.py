import os
import signal
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface
from dotenv import load_dotenv


if __name__ == "__main__":
    load_dotenv()
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
    AGENT_ID = os.getenv("AGENT_ID")

    client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

    conversation = Conversation(
        client=client,
        agent_id=AGENT_ID,
        requires_auth=bool(ELEVENLABS_API_KEY),
        audio_interface=DefaultAudioInterface(),
        callback_agent_response=lambda response: print(f"Agent: {response}"),
        callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
        callback_user_transcript=lambda transcript: print(f"User: {transcript}")
    )

    conversation.start_session()
    signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())
    conversation_id = conversation.wait_for_session_end()
    print(f"Conversation ID: {conversation_id}")

