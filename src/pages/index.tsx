import Head from "next/head";
import ToolCards from "components/ToolCards";
import Navbar from "components/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>WRD Internal Tools</title>
        <meta
          name="description"
          content="This website was created to house WRD iternally developed tools and was built using NextJS, React and Typescript."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/WRD-logo.ico" />
      </Head>
      <main className="home-page">
        <section>
          {/* Website Description */}
          <h1 className="home-header">WRD Internal Tools</h1>
          <p className="home-description">
            This website houses all of the internally developed design tools by
            Will Rudd Davidson.
            <br></br>
            <br></br>
            All of the tools for use can be seen using below. You can also click
            on these cards to take you directly to the tool.
          </p>
        </section>
        <section>
          {/* Internal Tool Cards */}
          <article className="tool-cards">
            <ToolCards />
          </article>
        </section>
      </main>
    </>
  );
}
