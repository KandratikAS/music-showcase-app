import { useState, useRef } from "react";
import { Card, Col, Badge, Button } from "react-bootstrap";
import { ThumbsUp, Play, Pause } from "lucide-react";
import { playSong } from "../utils/musicPlayer";

export default function SongCard({ song, onLike }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(song.liked || false);
  const [likesCount, setLikesCount] = useState(song.likes || 0);
  const playerRef = useRef(null);

  const handlePlayPause = async () => {
    if (!isPlaying) {
      playerRef.current = await playSong(song.id, song.genre);
      setIsPlaying(true);
    } else {
      if (playerRef.current?.stop) {
        playerRef.current.stop();
        playerRef.current = null;
      }
      setIsPlaying(false);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(likesCount - 1);
    } else {
      setIsLiked(true);
      setLikesCount(likesCount + 1);
    }
    onLike?.(); 
  };

  const likeButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
    border: "1px solid #0d6efd",
    borderRadius: "0.375rem",
    backgroundColor: isLiked ? "#0d6efd" : "transparent",
    color: isLiked ? "white" : "#0d6efd",
    cursor: "pointer",
     minWidth: "82px",
    transition: "all 0.2s",
  };

  const likeButtonHoverStyle = {
    backgroundColor: "#0d6efd",
    color: "white",
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Card className="shadow-sm">
        <Card.Img variant="top" src={song.cover} alt="cover" />
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title className="h6 mb-0">{song.title}</Card.Title>
            <Badge>{song.genre}</Badge>
          </div>
          <Card.Text className="text-muted small">{song.artist}</Card.Text>
          <Card.Text className="text-muted small">{song.album}</Card.Text>

          <button
            className="btn btn-outline-primary d-flex align-items-center gap-2 mb-3"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <div className="d-flex justify-content-start align-items-center gap-2">
            <div
              style={likeButtonStyle}
              onClick={handleLike}
              onMouseEnter={(e) => {
                if (!isLiked) Object.assign(e.currentTarget.style, likeButtonHoverStyle);
              }}
              onMouseLeave={(e) => {
                if (!isLiked)
                  Object.assign(e.currentTarget.style, {
                    backgroundColor: "transparent",
                    color: "#0d6efd",
                  });
              }}
            >
              <ThumbsUp size={16} />
              {isLiked ? "Liked" : "Like"}
            </div>
            <span className="text-primary small">{likesCount}</span>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

