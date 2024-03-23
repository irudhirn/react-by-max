import { useEffect } from 'react';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

import { useSelector, useDispatch } from 'react-redux';
import { sendCartData, fetchCartData } from './store/cart-actions';
import Notification from './components/UI/Notification';

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  useEffect(() => {
    if(isInitial){
      isInitial = false;
      return;
    }

    if(cart.changed){
      dispatch(sendCartData(cart));
    }

  }, [cart, dispatch]);

  return (
    <>
      {notification && <Notification status={notification.status} title={notification.title} message={notification.message}  />}
      <Layout>
        {showCart && ( <Cart /> )}
        <Products />
      </Layout>
    </>
  );
}

export default App;

/*

What is an "Action Creator"?

A function "showNotification" is an action creator. We get such action creators automatically by Redux-Toolkit and we call them to create the 'action objects' which we dispatch. Now we can also write our own action creators and we can write them to create a so-called "Thunk".

What is a "Thunk"?

A function that delays an action until later(until something else is finished). So we could write an Action Creator as a thunk to write another action creator which does not immediately return the action object, but which instead returns another function which eventually returns the action. So we can run some other code before we then dispatch the actual action object that we did want to create.

So to implement it, we can move sendingCartData logic into action-creator(in cart-slice.js file).

In cart-slice.js file, at the bottom we write normal function 'sendCartData' which will accept cartData as an argument. Then we create action creator which does not return such an action object but which instead returns another function. This function would receive 'dispatch' function as an argument, then inside of a function which we are returning, we can dispatch actual action we want to perform(like showing notificaton OR adding a cartItem). But before we call dispatch we can perform any async code/any side effects because we will not yet reached our reducer.

Then we export 'sendCartData' function from cart-slice.js file, import it in App.js and dispatch it and pass 'cart' as a parameter.

Before this what we dispatch was an action creators that returns an object with a type. Now we are dispatching a function that returns another function. And if Redux-Toolkit sees, that we're dispatching an action which is actually a function instead of action object, Redux will execute that function for us. And with that function (anonymous function inside 'sendCartData'), Redux will give us that dispatch argument automatically. So that in that executed function, we can dispatch again, because there's a such a common pattern that we want to have action creators that can perform side effects.

We can move 'sendCartData' function in different file (cart-actions.js file). We make separate file because we want to add one more action creator for fetching cart data.

*/

/*

// With side effects (without Action Creator Thunk)

import { useEffect } from 'react';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

import { useSelector, useDispatch } from 'react-redux';
import { uiActions } from './store/ui-slice';
import Notification from './components/UI/Notification';

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(uiActions.showNotification({ status: "pending", title: "Sending...", message: "Sending cart data!" }));
      const res = await fetch('https://advance-redux-9f2a6-default-rtdb.firebaseio.com/cart.json', {
        method: "PUT",
        body: JSON.stringify(cart),
      });

      if(!res.ok){
        throw new Error('Sending cart data failed');
        // dispatch(uiActions.showNotification({ status: "error", title: "Error", message: "Sending cart data failed!" }));
      }
      
      // const resData = await res.json();

      dispatch(uiActions.showNotification({ status: "success", title: "Success", message: "Sent cart data successfully!" }));
    }

    if(isInitial){
      isInitial = false;
      return;
    }

    sendCartData().catch((err) => dispatch(uiActions.showNotification({ status: "error", title: "Error", message: "Sending cart data failed!" })));
  }, [cart, dispatch]);

  return (
    <>
      {notification && <Notification status={notification.status} title={notification.title} message={notification.message}  />}
      <Layout>
        {showCart && ( <Cart /> )}
        <Products />
      </Layout>
    </>
  );
}

export default App;

*/