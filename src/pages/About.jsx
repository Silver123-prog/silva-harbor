export default function About() {
  return (
    <div className="prose">
      <h1>About Silva Harbor</h1>
      <p>
         Hi, I'm Michael Adebayo, a web developer based in Lagos. I built Silva Harbor
        to show how I structure a React app: routing, shared state, saved data
        and a layout that works from phone to desktop.
      </p>
      <h2>Why I built it</h2>
       <p>
        I wanted a planner that stays simple,
        so I built one myself and used it to practise React.
      </p>
       <h2>What's inside</h2>
      <ul>
        <li>React Router pages, including a dynamic route for each task.</li>
        <li>A context and reducer that keep tasks in one place.</li>
        <li>Custom hooks that save tasks and theme in the browser.</li>
        <li>Charts drawn with plain SVG and CSS, with no chart library.</li>
        <li>Keyboard focus styles, labelled controls and reduced-motion support.</li>
      </ul>
       <h2>Get in touch</h2>
      <p>
        Need a website or web app? Email me at {""}
        <a href="mailto:you@example.com">adebayomikky1@gmail.com</a> or find me on{" "}
        <a href="https://github.com/yourname" target="_blank" rel="noreferrer">Silver123-prog</a>.
      </p>
    </div>
  );
}
