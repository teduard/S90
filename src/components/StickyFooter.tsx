import { Box, Link } from "@cloudscape-design/components";

const FOOTER_HEIGHT = 50;

function StickyFooter() {
  return (
    <footer
      id="app-footer"
      style={{
        backgroundColor: "#eee",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: FOOTER_HEIGHT,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "0 24px",
      }}
    >
      <Link href="/S90/about" variant="secondary">
        About
      </Link>
      <Link
        href="https://github.com/teduard/S90"
        variant="secondary"
        external
      >
        Github
      </Link>

      <Box color="text-body-secondary" fontSize="body-s">
        © {new Date().getFullYear()}, S90
      </Box>
    </footer>
  );
}

export default StickyFooter;
