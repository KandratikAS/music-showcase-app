import Header from "../components/Header";
import TableView from "../components/TableView";
import PaginationBar from "../components/Paginationbar.jsx";
import GalleryView from "../components/Gallery.jsx";
import { useState, useEffect } from "react";
import { buildQuery } from "../utils/buildQuery";
import { getSongs } from "../api/songs.api.js";
import { VIEW_MODES } from "../constants/viewModes";
import { QUERY_PARAMS } from "../constants/queryParams.js";
import Loader from "../components/Loader.jsx";
import { UI_TEXT } from "../utils/lang.js";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export default function HomePage() {
  const [songs, setSongs] = useState([]);
  const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE);
  const [params, setParams] = useState(QUERY_PARAMS);
  const [expandedSongId, setExpandedSongId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const ui = UI_TEXT[params.lang] || UI_TEXT["en-US"];

  const fetchSongs = async (params) => {
    try {
      setIsLoading(true);
      const query = buildQuery(params);
      return await getSongs(query);
    } catch (err) {
      const errorMessage = err.message || "Server connection failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateParams = (newParams) => {
    setSongs([]);
    setExpandedSongId(null);
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page ?? 1,
    }));
  };

  useEffect(() => {
    const load = async () => {
      const data = await fetchSongs(params);
      if (!data) return;

      if (viewMode === VIEW_MODES.GALLERY && params.page > 1) {
        setSongs((prev) => [...prev, ...data]);
      } else {
        setSongs(data);
      }
    };
    load();
  }, [params, viewMode]);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    setSongs([]);
    setExpandedSongId(null);
    setParams((prev) => ({ ...prev, page: 1 }));
  };

  const toggleExpand = (id) => {
    setExpandedSongId((prevId) => (prevId === id ? null : id));
  };

  const loadNextPage = () => {
    setParams((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const handleLikeSong = (songId) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === songId ? { ...song, liked: true } : song
      )
    );
  };

  return (
    <div className="container mt-3">
      <Toaster position="top-right" reverseOrder={false} />

      <Header
        ui={ui}
        viewMode={viewMode}
        onViewChange={handleViewChange}
        lang={params.lang}
        seed={params.seed}
        likesAverage={params.likesAverage}
        onLangChange={(lang) => updateParams({ lang, page: 1 })}
        onSeedChange={(seed) => updateParams({ seed, page: 1 })}
        onRandomSeed={(seed) => updateParams({ seed, page: 1 })}
        onLikesChange={(likesAverage) => updateParams({ likesAverage })}
        tracks={songs}   
      />

      {viewMode === VIEW_MODES.TABLE &&
        (isLoading ? (
          <Loader />
        ) : (
          <TableView
            ui={ui}
            songs={songs}
            expandedSongId={expandedSongId}
            onToggle={toggleExpand}
          />
        ))}

      {viewMode === VIEW_MODES.GALLERY && (
        <GalleryView
          songs={songs}
          isLoading={isLoading}
          onLoadMore={loadNextPage}
          onLikeSong={handleLikeSong}
        />
      )}

      {viewMode === VIEW_MODES.TABLE && (
        <PaginationBar
          page={params.page}
          onPageChange={(newPage) =>
            setParams((prev) => ({ ...prev, page: newPage }))
          }
        />
      )}
    </div>
  );
}

