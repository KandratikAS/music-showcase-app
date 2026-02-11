import { Spinner } from "react-bootstrap";

export default function Loader({ size = "md" }) {
  return (
    <div className="d-flex justify-content-center my-4">
      <Spinner
        animation="border"
        role="status"
        size={size === "sm" ? "sm" : undefined}
      />
    </div>
  );
}
