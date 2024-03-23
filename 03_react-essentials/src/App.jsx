
import componentsImg from "./assets/components.png";

import { CORE_CONCEPTS, EXAMPLES } from "./data";
import Header from "./components/Header";
import CoreConcept from "./components/CoreConcept";
import TabButton from "./components/TabButton";
import { useState } from "react";

function App() {
  const [selectedTopic, setSelectedTopic] = useState("");

  function handleSelect(selectedButton){
    // selectedButton -> components, jsx, props, state
    setSelectedTopic(selectedButton);
    console.log(selectedButton);
  }


  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Time to get started!</h2>
          <ul>
            {CORE_CONCEPTS.map((conceptItem) => (<CoreConcept key={conceptItem.title} {...conceptItem} />))}
            {/* <CoreConcept title={CORE_CONCEPTS[0].title} description={CORE_CONCEPTS[0].description} image={CORE_CONCEPTS[0].image} />
            <CoreConcept title={CORE_CONCEPTS[1].title} description={CORE_CONCEPTS[1].description} image={CORE_CONCEPTS[1].image} />
            <CoreConcept title={CORE_CONCEPTS[2].title} description={CORE_CONCEPTS[2].description} image={CORE_CONCEPTS[2].image} />
            <CoreConcept {...CORE_CONCEPTS[3]} /> */}
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            <TabButton onSelect={() => handleSelect('components')} isSelected={selectedTopic === "components"}>Components</TabButton>
            <TabButton onSelect={() => handleSelect('jsx')} isSelected={selectedTopic === "jsx"}>JSX</TabButton>
            <TabButton onSelect={() => handleSelect('props')} isSelected={selectedTopic === "props"}>Props</TabButton>
            <TabButton onSelect={() => handleSelect('state')} isSelected={selectedTopic === "state"}>State</TabButton>
          </menu>
            {!selectedTopic && <p>Please select a topic.</p>}
            {selectedTopic && (
              <div id="tab-content">
                <h3>{EXAMPLES[selectedTopic].title}</h3>
                <p>{EXAMPLES[selectedTopic].description}</p>
                <pre>
                  <code>{EXAMPLES[selectedTopic].code}</code>
                </pre>
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default App;
