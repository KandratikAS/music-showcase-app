import debounce from "lodash.debounce";
import { useMemo, useState, useEffect } from "react";
import { generate64BitSeed } from "../utils/seedHelper";

import {
  Navbar,
  Container,
  Form,
  Row,
  Col,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { Shuffle, Table, BookImage, Download } from "lucide-react";
import { VIEW_MODES } from "../constants/viewModes";
import { LANGUAGES } from "../constants/languages";

import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Header({
  ui,
  viewMode,
  onViewChange,
  lang,
  seed,
  likesAverage,
  onLangChange,
  onSeedChange,
  onRandomSeed,
  onLikesChange,
  tracks, 
}) {
  const [localSeed, setLocalSeed] = useState(seed);
  const [localLikes, setLocalLikes] = useState(likesAverage);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isExporting, setIsExporting] = useState(false); 

  useEffect(() => setLocalSeed(seed), [seed]);
  useEffect(() => setLocalLikes(likesAverage), [likesAverage]);

  const debounced = useMemo(
    () =>
      debounce((callback, value) => {
        callback(value);
      }, 500),
    []
  );

  const handleRandomClick = () => {
    const newSeed = generate64BitSeed();
    setIsShuffling(true);
    onRandomSeed(newSeed);
    setTimeout(() => setIsShuffling(false), 500);
  };

  const handleExport = async () => {
    if (!tracks || tracks.length === 0) return;
    setIsExporting(true);

    const zip = new JSZip();
    for (const track of tracks) {
      try {
        const response = await fetch(track.mp3Url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${track.mp3Url}`);
        const blob = await response.blob();
        const safeFileName = `${track.title} - ${track.album} - ${track.artist}.mp3`.replace(
          /[\/\\?%*:|"<>]/g,
          "-"
        );
        zip.file(safeFileName, blob);
      } catch (err) {
        console.error("Ошибка при загрузке трека:", track, err);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "songs.zip");
    setIsExporting(false);
  };

  const styles = {
    navbar: {
      background: "#0f111a",
      borderBottom: "2px solid #2a2d3e",
      padding: "1rem 2rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    },
    label: {
      fontWeight: 600,
      color: "#f0f4ff",
      whiteSpace: "nowrap",
      marginBottom: "0.3rem",
    },
    seedInput: {
      maxWidth: "120px",
      textAlign: "center",
      borderRadius: "6px",
      border: "1px solid #3a3f5c",
      background: "#1b1e2f",
      color: "#f0f4ff",
    },
    button: {
      borderRadius: "6px",
      transition: "all 0.2s ease-in-out",
      color: "#f0f4ff",
      borderColor: "#3a3f5c",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    rangeWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      minWidth: "200px",
    },
    range: {
      accentColor: "#4f95ff",
    },
    spanLikes: {
      color: "#f0f4ff",
      fontWeight: 600,
      minWidth: "35px",
      textAlign: "center",
    },
  };

  return (
    <Navbar style={styles.navbar} expand="lg">
      <Container fluid>
        <Form className="w-100">
          <Row
            className="align-items-center"
            style={{ flexWrap: "nowrap", justifyContent: "space-between" }}
          >
            <Col className="d-flex align-items-center" xs="auto" style={{ gap: "90px" }}>
              <Form.Group className="d-flex align-items-center" style={{ gap: "8px" }}>
                <Form.Label style={styles.label}>{ui.tableRegion}:</Form.Label>
                <Form.Select
                  value={lang}
                  onChange={(e) => onLangChange(e.target.value)}
                  style={{
                    background: "#1b1e2f",
                    color: "#f0f4ff",
                    border: "1px solid #3a3f5c",
                  }}
                >
                  {LANGUAGES.map(({ code, label }) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="d-flex align-items-center" style={{ gap: "8px" }}>
                <Form.Label style={styles.label}>{ui.tableSeed}:</Form.Label>
                <Form.Control
                  type="text"
                  value={localSeed}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      setLocalSeed(val);
                      debounced(onSeedChange, val);
                    }
                  }}
                  placeholder="Enter seed"
                  style={styles.seedInput}
                />
                <Button
                  variant="light"
                  onClick={handleRandomClick}
                  style={{
                    ...styles.button,
                    background: "linear-gradient(135deg, #4f95ff, #7f5fff)",
                    border: "none",
                    padding: "0.35rem",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                >
                  <Shuffle
                    size={20}
                    style={{
                      display: "inline-block",
                      transition: "transform 0.5s",
                      transform: isShuffling ? "rotate(360deg)" : "rotate(0deg)",
                    }}
                  />
                </Button>
              </Form.Group>

              <Form.Group className="d-flex align-items-center" style={{ gap: "8px" }}>
                <Form.Label style={styles.label}>{ui.tableLikes}:</Form.Label>
                <Form.Range
                  value={localLikes}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setLocalLikes(val);
                    debounced(onLikesChange, val);
                  }}
                  min={0}
                  max={10}
                  step={0.1}
                  style={{ ...styles.range, width: "250px" }}
                />
                <span style={{ ...styles.spanLikes, fontSize: "1rem", minWidth: "40px" }}>
                  {localLikes.toFixed(1)}
                </span>

                <Button
                  variant="dark"
                  onClick={handleExport}
                  disabled={isExporting}
                  style={{
                    ...styles.button,
                    width: "40px",
                    height: "36px",
                    padding: "0.3rem",
                    background: isExporting ? "#3a3f5c" : "#1b1e2f",
                    border: "1px solid #3a3f5c",
                    marginLeft: "8px",
                  }}
                  onMouseEnter={(e) => !isExporting && (e.currentTarget.style.background = "#2a2d3e")}
                  onMouseLeave={(e) => !isExporting && (e.currentTarget.style.background = "#1b1e2f")}
                >
                  <Download size={18} />
                </Button>
              </Form.Group>
            </Col>

            <Col className="d-flex align-items-center justify-content-end" xs="auto">
              <ButtonGroup size="sm" style={{ display: "flex", gap: "8px" }}>
                <Button
                  title="Table View"
                  variant={viewMode === VIEW_MODES.TABLE ? "primary" : "outline-primary"}
                  onClick={() => onViewChange(VIEW_MODES.TABLE)}
                  style={styles.button}
                >
                  <Table size={18} />
                </Button>
                <Button
                  title="Gallery View"
                  variant={viewMode === VIEW_MODES.GALLERY ? "primary" : "outline-primary"}
                  onClick={() => onViewChange(VIEW_MODES.GALLERY)}
                  style={styles.button}
                >
                  <BookImage size={18} />
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Form>
      </Container>
    </Navbar>
  );
}
