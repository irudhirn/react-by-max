import { useState } from 'react';

import ConfigureCounter from './components/Counter/ConfigureCounter.jsx';
import Counter from './components/Counter/Counter.jsx';
import Header from './components/Header.jsx';
import { log } from './log.js';

function App() {
  log('<App /> rendered');

  // const [enteredNumber, setEnteredNumber] = useState(0);
  const [chosenCount, setChosenCount] = useState(0);

  // function handleChange(event) {
  //   setEnteredNumber(+event.target.value);
  // }

  // function handleSetClick() {
  //   setChosenCount(enteredNumber);
  //   setEnteredNumber(0);
  // }

  function handleSetCount(newVal){
    setChosenCount(newVal);
  }

  return (
    <>
      <Header />
      <main>
        <ConfigureCounter onSet={handleSetCount} />
        {/* <section id="configure-counter">
          <h2>Set Counter</h2>
          <input type="number" onChange={handleChange} value={enteredNumber} />
          <button onClick={handleSetClick}>Set</button>
        </section> */}
        <Counter initialCount={chosenCount} />
      </main>
    </>
  );
}

export default App;

/*

memo() function

When we make mutate state in any child component, in our case Counter component, only that component and its child components are re-rendered. But if we make change in parent level component (if we mutate state of input field in App.jsx), entire app is re-rendered, because 'App' is top-most component in app & it is the component that we are rendering in index.html file.

So solution to this is to use memo() function provided by react. Then we wrap 'Counter' component in this memo() function as a value OR as an argument to memo.

What memo() will do is that it'll look at props of that component function, and whenever the component functionwould normally execute again (in our case when state in App.jsx is mutated), memo() will look at the old props value and at the new prop value that would be received now if that component function would execute and if those prop values are exactly same (for e.g. arrays and objects are exactly supposed to be exactly the same in memory), then that component function execution will be prevented by memo().

So Counter component function will only be re-executed if 'initialCount' (prop coming from App.jsx) changed OR it's internal state changed. So memo() only prevents component function re-execution triggered by the parent component.

DON'T OVERUSE memo()

Even though it's helpful, we should wrap every component function in memo(). We should use it as high up in the component tree possible. Because if we wrap every component function, that would simply mean that React always has to check the props before it executes the component function. And this check for prop values equality could cost some performance. Also in small apps it doesn't have any measurable impact.

*/

/*

Avoiding function executions with clever structuring

Even though memo() is useful, what is more OR equally useful is Clever Component Composition. For e.g. <section> in which we are configuring counter can, be put in different component.

By doing this, we now make sure that enteredNumber state which is mutated on every keystroke lives in separated component function and therefore doesn't trigger re-execution of parent component App.jsx and therefore avoiding re-execution of Counter.jsx.

And now at this point, using memo() in Counter.jsx is not useful, because on changing enteredNumber entire app is not re-executed, but on invoking handleSetCount, chosenCount state is mutated, therefore Counter.jsx re-executed because that's the prop we are passing to Counter.jsx. So anyway, if Counter is re-executed on mutating chosenCount, it doesn't make sense to use memo() since exactly that is the prop whose old and new value is compared by memo().

*/

/*

useCallback

We now wrap IconButton component in memo() to avoid component re-execution. But it won't work. It's not because children prop OR icon prop, but due to function coming through onClick prop from Counter.jsx. This onClick props are passing the function which increments or decrements the value of counter and this counter function is re-executed everytime counter state is updated, and during this re-execution handleIncrement() and handleDecrement() functions are recreated, and that's why old and new functions in memory(which are compared by memo()) are not same, that's memo() doesn't work when we are trying to stop re-rendering of IconButton when state in Counter changes. 

So we need to stop recreation of handleIncrement() & handleDecrement() function, and we can achieve that by wrapping those in useCallback which accepts second argument as dependency array.

*/

/*

useMemo

In Counter.jsx, isPrime function is checking only the first value it's getiing is prime or not. But still that function is re-executed with every component re-render even though it's only checking the very first value (initialCount) component getting through prop, so basically it's going to provide same result. So re-executing a isPrime() function and code inside even though it's going to provide same result is not efficient. Therefor just like we prevent re-rendering of child component functions with memo(), we could also prevent re-execution of normal functions unless their input is changed.

To achieve this, a useMemo() is provide by React. We call useMemo() inside it first argument will be anonymous arrow function inside which we call isPrime(), and second argument is a dependency array (in dependency array we mostly pass an input value we'll passing to isPrime() function).

Note: useMemo() not to be confused with memo(), memo() is wrapped around component functions and useMemo() is wrapped around normal functions which are ececuted in component functions.

*/