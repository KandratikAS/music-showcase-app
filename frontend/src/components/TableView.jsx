import { Table } from "react-bootstrap";
import SongDetails from "../components/SongDetails";
import React from "react";

export default function TableView({ ui, songs, expandedSongId, onToggle, onLikeSong }) {
  return (
    <div className="mt-3">
      <Table hover responsive="sm" className="align-middle">
        <thead>
          <tr>
            <th>{ui.tableIndex}</th>
            <th>{ui.tableSong}</th>
            <th>{ui.tableArtist}</th>
            <th>{ui.tableAlbum}</th>
            <th>{ui.tableGenre}</th>
          </tr>
        </thead>

        <tbody>
          {songs.map((song) => (
            <React.Fragment key={song.id}>
              <tr
                onClick={() => onToggle(song.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{song.index}</td>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.album}</td>
                <td>{song.genre}</td>
              </tr>

              {expandedSongId === song.id && (
                <SongDetails
                  song={song}
                  onLike={onLikeSong}
                />
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

