import react, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

const PaymentComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let [payment, setPayment] = useState({});
  const bookList = location.state.bookList;
  const currentUser = location.state.currentUser;
  let [books, setBooks] = useState(location.state.bookList.books);
  

  const subTotal = () => {
    return books.reduce(
      (a, b) =>
        a + (b.salePrice.amount === "N/A" ? 0 : parseFloat(b.salePrice.amount)),
      0
    );
  };

  const tax = () => {
    return subTotal() * 0.13;
  };

  const total = () => {
    return subTotal() + tax();
  };


  const handlePaymentSuccess = () => {
    window.alert("Payment Successful");
    navigate("/me");
  };

  //https://www.npmjs.com/package/react-credit-cards-2
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };
  const handleInputFocus = (e) => {
    setState((prev) => ({ ...prev, focus: e.target.name }));
  };

  return (
    <div className="d-flex flex-row justify-content-between mw-100 m-5 p-5 border shadow-lg p-3 mb-5 bg-white rounded">
      <div className="flex-fill d-flex flex-column justify-content-between">
        <div className="border shadow-sm p-3 mb-5 bg-white rounded m-3 overflow-scroll">
          <h3>Order Summary</h3>
          <h6>Items:</h6>
          {books && (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>
                      {book.salePrice.amount === "N/A"
                        ? "$ 0.00 (Free)"
                        : `$ ${book.salePrice.amount}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <table className="table p-3 mb-5 bg-white rounded p-3">
            <tbody>
              <tr>
                <td>
                  <h5>Subtotal:</h5>
                </td>
                <td>
                  <h5>$ {subTotal().toFixed(2)}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h5>Tax:</h5>
                </td>
                <td>
                  <h5>$ {tax().toFixed(2)}</h5>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>Total:</h3>
                </td>
                <td>
                  <h3>$ {total().toFixed(2)}</h3>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex-fill p-5 border shadow-sm p-3 mb-5 bg-white rounded m-3">
        <h1 className="mb-5">Payment Methods</h1>
        <Cards
          number={state.number}
          expiry={state.expiry}
          cvc={state.cvc}
          name={state.name}
          focused={state.focus}
        />
        <form className="d-flex flex-column justify-content-around">
          <div className="form-floating mb-3 mt-5">
            <input
              type="number"
              name="number"
              id="card number"
              maxLength="16"
              placeholder="Card Number"
              value={state.number}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="form-control"
            />
            <label htmlFor="card number" className="form-label">
              Card Number
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={state.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="form-control"
            />
            <label htmlFor="name" className="form-label">
              Name
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              name="expiry"
              maxLength="4"
              placeholder="MM/YY Expiry"
              value={state.expiry}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="form-control"
            />
            <label htmlFor="expiry">Expiry</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              name="cvc"
              maxLength="3"
              placeholder="CVC"
              value={state.cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="form-control"
            />
            <label htmlFor="cvc" className="form-label">
              CVC
            </label>
          </div>
          <h4>Delivery Address</h4>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="Address"
              id="Address"
              placeholder="Address"
              className="form-control"
            />
            <label htmlFor="Address" className="form-label">
              Address
            </label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              name="city"
              id="city"
              placeholder="City"
              className="form-control"
            />
            <label htmlFor="city" className="form-label">
              City
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="province"
              id="province"
              placeholder="Province"
              className="form-control"
            />
            <label htmlFor="province" className="form-label">
              Province
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              placeholder="Postal Code"
              className="form-control"
            />
            <label htmlFor="postalCode" className="form-label">
              Postal Code
            </label>
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="sameAsBilling"
              id="sameAsBilling"
              className="form-check-input"
              checked
            />
            <label htmlFor="sameAsBilling" className="form-check-label">
              Same as Billing Address
            </label>
          </div>

          <button className="btn btn-outline-primary shadow" onClick={handlePaymentSuccess}>Pay</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;
