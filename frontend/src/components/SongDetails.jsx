import { useState, useEffect, useRef } from "react";
import { ThumbsUp, Play, Pause, MessageCircle } from "lucide-react";
import { playSong } from "../utils/musicPlayer";
import * as Tone from "tone";

export default function SongDetails({ song, onLike }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(song.liked || false);
  const [likesCount, setLikesCount] = useState(song.likes || 0);
  const [currentTime, setCurrentTime] = useState(0);

  const lyricsRef = useRef(null);
  const isInitializedRef = useRef(false);
  const cleanupSongRef = useRef(null);

const togglePlay = async () => {

  if (!isInitializedRef.current) {
    await Tone.start();
    cleanupSongRef.current = await playSong(song.id, song.genre);
    isInitializedRef.current = true;
    setIsPlaying(true);
    return;
  }

  if (Tone.Transport.state === "started") {
    Tone.Transport.pause();
    setIsPlaying(false);
  } else {
    Tone.Transport.start();
    setIsPlaying(true);
  }
};

  const handleLike = () => {
    setIsLiked(prev => !prev);
    setLikesCount(prev => prev + (isLiked ? -1 : 1));
    onLike?.();
  };

  useEffect(() => {
    let id;
    if (isPlaying) {
      id = Tone.Transport.scheduleRepeat(() => {
        setCurrentTime(Tone.Transport.seconds);
      }, 0.03); // 
    }
    return () => {
      if (id != null) Tone.Transport.clear(id);
    };
  }, [isPlaying]);

  useEffect(() => {
    const el = lyricsRef.current?.querySelector('[data-active="true"]');
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentTime]);

  useEffect(() => {
    return () => {
      if (cleanupSongRef.current) cleanupSongRef.current();
    };
  }, []);

  const renderLyrics = () => {
    if (!song.lyrics || !Array.isArray(song.lyrics)) return null;

    return song.lyrics.map((line, i) => (
      <div key={i} style={{ marginBottom: 6 }}>
        {line.words.map((word, j) => {
          const nextWord = line.words[j + 1];
          const isActive =
            currentTime >= word.time && (!nextWord || currentTime < nextWord.time);
          return (
            <span
              key={j}
              data-active={isActive}
              style={{
                color: isActive ? "#ffcc00" : "#333",
                fontWeight: isActive ? 600 : 400,
                marginRight: 4,
                transition: "all 0.08s linear"
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    ));
  };

  const likeButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid #0d6efd",
    backgroundColor: isLiked ? "#0d6efd" : "transparent",
    color: isLiked ? "white" : "#0d6efd",
    fontWeight: 500
  };

  return (
    <tr className="bg-light">
      <td colSpan={5}>
        <div className="d-flex align-items-center gap-3 p-2 flex-wrap">
          <img
            src={song.cover}
            alt="cover"
            style={{ width: 80, height: 80, borderRadius: 8 }}
          />

          <div style={{ minWidth: 200 }}>
            <div className="fw-bold">{song.title}</div>
            <div className="text-muted small">{song.artist} — {song.album}</div>

            <div className="d-flex align-items-center gap-2 mt-1">
              <div
                style={likeButtonStyle}
                onClick={handleLike}
                onMouseEnter={(e) => !isLiked && (e.currentTarget.style.backgroundColor = "#0d6efd")}
                onMouseLeave={(e) => !isLiked && (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <ThumbsUp size={14} /> {isLiked ? "Liked" : "Like"}
              </div>
              <span className="text-primary small">{likesCount}</span>
            </div>
          </div>

          <button
            className="btn btn-outline-primary d-flex align-items-center gap-1"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <div
            ref={lyricsRef}
            style={{
              maxHeight: 160,
              overflowY: "auto",
              fontSize: 14,
              lineHeight: 1.8,
              paddingRight: 6,
              paddingLeft: 10,
              borderLeft: "2px solid #eee",
              minWidth: 260
            }}
          >
            {renderLyrics()}
          </div>

          {song.review && (
            <div
              style={{
                maxWidth: 400,
                marginLeft: 20,
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: 12,
                textOverflow: "ellipsis",
                fontStyle: "italic",
                color: "#555",
                display: "flex",
                alignItems: "center",
                gap: 4
              }}
            >
              <MessageCircle size={16} />
              "{song.review}"
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
