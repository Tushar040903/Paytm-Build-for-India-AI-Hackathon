import logging
import os
import sys

# Setup logging
LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

class SafeStreamHandler(logging.StreamHandler):
    """StreamHandler that replaces non-encodable characters to avoid Windows cp1252 crashes."""
    def emit(self, record):
        try:
            msg = self.format(record)
            stream = self.stream
            # Safely write using stream's encoding with backslashreplace or utf-8
            stream.write(msg.encode(stream.encoding or "utf-8", errors="replace").decode(stream.encoding or "utf-8") + self.terminator)
            self.flush()
        except Exception:
            self.handleError(record)

def setup_logger(name: str = "DukaanSaathi") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    if not logger.handlers:
        console_handler = SafeStreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        formatter = logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
        
        log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "logs")
        os.makedirs(log_dir, exist_ok=True)
        file_path = os.path.join(log_dir, "dukaansaathi.log")
        try:
            file_handler = logging.FileHandler(file_path, encoding="utf-8")
            file_handler.setLevel(logging.DEBUG)
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            print(f"Warning: Could not setup file logger at {file_path}: {e}")
            
    return logger

logger = setup_logger("DukaanSaathi")
