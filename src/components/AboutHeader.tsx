import Box from "@cloudscape-design/components/box";
import Grid from "@cloudscape-design/components/grid";
import "./HeroHeader.css";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";

function AboutHeader() {
  return (
    <>
      <SpaceBetween size="l">
        <ContentLayout
          defaultPadding
          disableOverlap
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          headerBackgroundStyle={(_mode) =>
            `center center/cover url("/S90/assets/hero.jpg") no-repeat`
          }
          header={
            <Box padding={{ vertical: "xxxl" }}>
              <Grid gridDefinition={[{ colspan: { default: 12, s: 8 } }]}>
                <Container>
                  <Box padding="s">
                    <Box
                      fontSize="display-l"
                      fontWeight="bold"
                      variant="h1"
                      padding="n"
                    >
                      About <span className="gradient">S90</span>
                    </Box>
                    <Box fontSize="display-l" fontWeight="light">
                      100% Offline & Private
                    </Box>
                    <Box
                      variant="p"
                      color="text-body-secondary"
                      margin={{ top: "xs", bottom: "l" }}
                    >
                      Your data never leaves your device.
                    </Box>
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button
                        variant="primary"
                        fullWidth={false}
                        href={`${import.meta.env.BASE_URL}login`}
                      >
                        Try the demo
                      </Button>
                    </SpaceBetween>
                  </Box>
                </Container>
              </Grid>
            </Box>
          }
        />

        <h1>
          In an era of fragmented apps and scattered data, S90 provides a
          unified ecosystem for personal operations.
        </h1>
        <h1>
          Designed with the precision of industrial software, our suite bridges
          the gap between professional-level data management and daily life.
        </h1>
        <h1>
          Unified Interface: A single, cohesive design language (Cloudscape)
          that reduces cognitive load.
        </h1>
        <h1>
          {" "}
          Actionable Intelligence: Moving beyond mere "logging" to provide
          real-time, SQL-driven insights.
        </h1>

        <Grid
          gridDefinition={[
            { colspan: { default: 12, m: 4 } },
            { colspan: { default: 12, m: 4 } },
            { colspan: { default: 12, m: 4 } },
          ]}
        >
          <div
            style={{
              height: "200px",
              display: "flex",
              flexDirection: "column",
              background: "rgba(200,200,100,.2)",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          >
            <Box padding="s">
              <Box
                fontSize="display-l"
                fontWeight="bold"
                variant="h1"
                padding="n"
              >
                Completely transparent
              </Box>
              <Box fontWeight="light">
                {" "}
                Total Ownership: Your data remains in your browser, under your
                control, at all times.
              </Box>
            </Box>
          </div>
          <div
            style={{
              height: "200px",
              display: "flex",
              flexDirection: "column",
              background: "rgba(200,200,100,.2)",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          >
            <Box padding="s">
              <Box
                fontSize="display-l"
                fontWeight="bold"
                variant="h3"
                padding="n"
              >
                No Vendor Lock-in
              </Box>
              <Box fontWeight="light">Export your data anytime</Box>
            </Box>
          </div>

          <div
            style={{
              height: "200px",
              display: "flex",
              flexDirection: "column",
              background: "rgba(200,200,100,.2)",
              borderRadius: "20px",
              border: "1px solid #ccc",
            }}
          >
            <Box padding="s">
              <Box
                fontSize="display-l"
                fontWeight="bold"
                variant="h1"
                padding="n"
              >
                Maximum privacy
              </Box>
              <Box fontWeight="light">Your data belongs to you</Box>
            </Box>
          </div>
        </Grid>
      </SpaceBetween>
    </>
  );
}

export { AboutHeader };
