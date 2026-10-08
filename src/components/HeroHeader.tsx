import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Grid from "@cloudscape-design/components/grid";
import SpaceBetween from "@cloudscape-design/components/space-between";

import apps from "/assets/apps.png";

import "./HeroHeader.css";

function HeroHeader() {
  return (
    <Box data-testid="hero-header" padding={{ top: "xs", bottom: "l" }}>
      <Grid
        gridDefinition={[
          { colspan: { default: 12, xs: 6, s: 7 } },
          { colspan: { default: 12, xs: 6, s: 5 } },
        ]}
      >
        <div>
          <Box variant="awsui-value-large">
            <br />
            Enterprise-grade tools for <br />
            <span className="gradient">personal operations.</span>
          </Box>
          <Box
            variant="h2"
            color="text-body-secondary"
            margin={{ top: "xxs", bottom: "s" }}
          >
            <br />
            Daily optimization, powered by data.
            <br />
            <br />
            Leverage actionable insights from a professional suite of tools to
            improve your next move.
          </Box>
        </div>

        <Box margin={{ top: "l" }}>
          <SpaceBetween size="l">
            <img src={apps} alt="S90 Apps" width="300" />

            <Box textAlign="center">
              <Button
                variant="primary"
                fullWidth={false}
                href={`${import.meta.env.BASE_URL}login`}
              >
                Try the demo
              </Button>
              <h3>your data never leaves your browser</h3>
            </Box>
          </SpaceBetween>
        </Box>
      </Grid>
    </Box>
  );
}

export { HeroHeader };
