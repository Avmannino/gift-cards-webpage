import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Gift,
  Wallet,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import wingsLogo from "./assets/wings-logo.png";
import "./App.css";

const PRESET_AMOUNTS = [25, 50, 75, 100, 150, 200];

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const benefits = [
  {
    icon: Gift,
    title: "For Every Occasion",
    description:
      "Birthdays, holidays, celebrations or simply a reason to surprise someone.",
  },
  {
    icon: Wallet,
    title: "Your Gift, Your Amount",
    description:
      "Choose from our suggested amounts or select a custom gift card balance.",
  },
  {
    icon: ClipboardCheck,
    title: "Simple to Request",
    description:
      "Submit your request and our team will follow up to finalize your purchase.",
  },
];

function App() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const rawAmount =
    selectedAmount === "custom"
      ? Number(customAmount)
      : selectedAmount;

  const giftCardAmount =
    Number.isFinite(rawAmount) && rawAmount > 0
      ? Math.round(rawAmount * 100) / 100
      : 0;

  const numericQuantity = Number(quantity);

  const validQuantity =
    Number.isInteger(numericQuantity) &&
    numericQuantity >= 1 &&
    numericQuantity <= 99;

  const totalAmount = validQuantity
    ? giftCardAmount * numericQuantity
    : 0;

  const isSubmitting = status === "submitting";

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (
      !ACCESS_KEY ||
      ACCESS_KEY === "YOUR_ACCESS_KEY_HERE"
    ) {
      setStatus("error");
      setStatusMessage(
        "The request form is currently unavailable. Please contact Wings Arena directly."
      );
      return;
    }

    if (
      giftCardAmount < 1 ||
      !validQuantity ||
      !Number.isFinite(totalAmount)
    ) {
      setStatus("error");
      setStatusMessage(
        "Please enter a valid gift card amount and quantity."
      );
      return;
    }

    if (formData.has("botcheck")) {
      setStatus("error");
      setStatusMessage(
        "Unable to submit your request. Please try again."
      );
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    const firstName = String(
      formData.get("first_name") || ""
    ).trim();

    const lastName = String(
      formData.get("last_name") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    ).trim();

    const phone = String(
      formData.get("phone") || ""
    ).trim();

    if (!firstName || !lastName || !email || !phone) {
      setStatus("error");
      setStatusMessage(
        "Please complete all required contact fields."
      );
      return;
    }

    const submission = {
      access_key: ACCESS_KEY,

      subject: "New Wings Arena Gift Card Request",
      from_name: "Wings Arena Gift Cards",

      name: `${firstName} ${lastName}`,
      email: email,

      "First Name": firstName,
      "Last Name": lastName,
      "Phone Number": phone,

      "Gift Card Balance": formatCurrency(giftCardAmount),
      "Quantity": numericQuantity,
      "Total Requested Value": formatCurrency(totalAmount),
    };

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(submission),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Submission failed."
        );
      }

      setStatus("success");

      setStatusMessage(
        "Your gift card request has been received! A member of our team will be in touch to finalize your purchase."
      );

      form.reset();

      setSelectedAmount(50);
      setCustomAmount("");
      setQuantity("1");
    } catch {
      setStatus("error");

      setStatusMessage(
        "We couldn't submit your request. Please try again or contact Wings Arena directly."
      );
    }
  }

  return (
    <div className="site-wrapper">
      <main>
        {/* HERO SECTION */}

        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />

          <div className="container hero-grid">
            <div className="hero-content">
              <h1>
                Wings Arena
                <br />
                <span>Gift Cards</span>
              </h1>

              <p>
                Give them something to look forward to.
                Wings Arena gift cards are a great way to
                celebrate any occasion and share the
                excitement of the ice.
              </p>

              <a
                href="#gift-card-request"
                className="primary-button hero-button"
              >
                Request a Gift Card
                <ArrowRight size={20} />
              </a>
            </div>

            <div className="hero-visual">
              <div
                className="card-decoration decoration-one"
                aria-hidden="true"
              />
              <div
                className="card-decoration decoration-two"
                aria-hidden="true"
              />

              <div
                className="gift-card-stack"
                aria-hidden="true"
              >
                <div className="gift-card-back">
                  <div className="magnetic-strip" />

                  <div className="back-card-text">
                    WINGS ARENA
                  </div>
                </div>

                <div className="gift-card-front">
                  <div className="gift-card-pattern" />

                  <img
                    src={wingsLogo}
                    alt=""
                    className="card-logo"
                  />

                  <span className="gift-card-label">
                    GIFT CARD
                  </span>
                </div>
              </div>

              <div className="launch-label visual-caption">
                <span className="launch-dot" />
                NOW AVAILABLE
              </div>
            </div>
          </div>

          <a
            className="scroll-indicator"
            href="#about-gift-cards"
            aria-label="Learn more about gift cards"
          >
            <ArrowDown size={20} />
          </a>
        </section>

        {/* PROMOTIONAL SECTION */}

        <section
          className="benefits-section"
          id="about-gift-cards"
        >
          <div className="container">
            <div className="section-heading centered">
              <h2>A Gift for Every Occasion.</h2>

              <p>
                From first-time skaters to lifelong hockey
                players, give the ice enthusiast in your
                life something they'll enjoy.
              </p>
            </div>

            <div className="benefits-grid">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    className="benefit-card"
                    key={benefit.title}
                  >
                    <div className="benefit-icon">
                      <Icon size={25} strokeWidth={1.8} />
                    </div>

                    <h3>{benefit.title}</h3>

                    <p>{benefit.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* REQUEST SECTION */}

        <section
          className="request-section"
          id="gift-card-request"
        >
          <div className="container">
            <div className="section-heading request-heading">
              <h2>Make Someone's Day.</h2>

              <p>
                Complete the form below and a member of
                our team will reach out to finalize your
                gift card purchase.
              </p>
            </div>

            <div className="request-grid">
              {/* REQUEST FORM */}

              <div className="form-card">
                <form
                  onSubmit={handleSubmit}
                  aria-busy={isSubmitting}
                >
                  <fieldset
                    className="form-fieldset"
                    disabled={isSubmitting}
                  >
                    {/* STEP ONE */}

                    <div className="form-section">
                      <div className="form-section-heading">
                        <span className="step-number">
                          01
                        </span>

                        <div>
                          <h3>Choose Your Amount</h3>
                          <p>
                            Select the balance for each gift
                            card.
                          </p>
                        </div>
                      </div>

                      <fieldset className="amount-fieldset">
                        <legend className="sr-only">
                          Gift card balance
                        </legend>

                        <div className="amount-grid">
                          {PRESET_AMOUNTS.map((amount) => (
                            <label
                              key={amount}
                              className={`amount-option ${
                                selectedAmount === amount
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name="amount_option"
                                value={amount}
                                checked={
                                  selectedAmount === amount
                                }
                                onChange={() =>
                                  setSelectedAmount(amount)
                                }
                              />

                              <span>${amount}</span>
                            </label>
                          ))}
                        </div>

                        <label
                          className={`custom-option ${
                            selectedAmount === "custom"
                              ? "selected"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="amount_option"
                            value="custom"
                            checked={
                              selectedAmount === "custom"
                            }
                            onChange={() =>
                              setSelectedAmount("custom")
                            }
                          />

                          Custom Amount
                        </label>
                      </fieldset>

                      {selectedAmount === "custom" && (
                        <div className="field custom-amount-field">
                          <label htmlFor="custom_amount">
                            Enter your desired balance
                            <span className="required">*</span>
                          </label>

                          <div className="currency-input">
                            <span>$</span>

                            <input
                              id="custom_amount"
                              type="number"
                              name="custom_amount"
                              min="1"
                              step="0.01"
                              inputMode="decimal"
                              placeholder="0.00"
                              value={customAmount}
                              onChange={(event) =>
                                setCustomAmount(
                                  event.target.value
                                )
                              }
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="field quantity-field">
                        <label htmlFor="quantity">
                          Quantity
                          <span className="required">*</span>
                        </label>

                        <input
                          id="quantity"
                          type="number"
                          name="quantity"
                          min="1"
                          max="99"
                          step="1"
                          value={quantity}
                          onChange={(event) =>
                            setQuantity(event.target.value)
                          }
                          required
                        />

                        <span className="field-hint">
                          Each gift card will have the
                          selected balance.
                        </span>
                      </div>
                    </div>

                    {/* STEP TWO */}

                    <div className="form-section last-section">
                      <div className="form-section-heading">
                        <span className="step-number">
                          02
                        </span>

                        <div>
                          <h3>Your Information</h3>

                          <p>
                            Let us know how to reach you.
                          </p>
                        </div>
                      </div>

                      <div className="fields-grid">
                        <div className="field">
                          <label htmlFor="first_name">
                            First Name
                            <span className="required">*</span>
                          </label>

                          <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            placeholder="First name"
                            autoComplete="given-name"
                            maxLength={100}
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="last_name">
                            Last Name
                            <span className="required">*</span>
                          </label>

                          <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            placeholder="Last name"
                            autoComplete="family-name"
                            maxLength={100}
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="email">
                            Email Address
                            <span className="required">*</span>
                          </label>

                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            maxLength={254}
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="phone">
                            Phone Number
                            <span className="required">*</span>
                          </label>

                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="(123) 456-7890"
                            autoComplete="tel"
                            maxLength={30}
                            required
                          />
                        </div>
                      </div>

                      {/* Honeypot spam protection */}

                      <input
                        type="checkbox"
                        name="botcheck"
                        className="honeypot"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                      />
                    </div>

                    <button
                      type="submit"
                      className="primary-button submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoaderCircle
                            className="spinner"
                            size={20}
                          />
                          Submitting Request...
                        </>
                      ) : (
                        <>
                          Submit Gift Card Request
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </fieldset>

                  <div
                    className="form-disclaimer"
                  >
                    <ShieldCheck size={18} />

                    <p>
                      No payment is collected through this
                      form. Our team will contact you to
                      arrange payment and fulfillment.
                    </p>
                  </div>

                  {/* FORM STATUS */}

                  {status === "success" && (
                    <div
                      className="form-status success-status"
                      role="status"
                    >
                      <CheckCircle2 size={25} />

                      <div>
                        <strong>Request Received!</strong>
                        <p>{statusMessage}</p>
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <div
                      className="form-status error-status"
                      role="alert"
                    >
                      <AlertCircle size={25} />

                      <div>
                        <strong>Unable to Submit</strong>
                        <p>{statusMessage}</p>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* ORDER SUMMARY */}

              <aside className="summary-column">
                <div className="summary-card">
                  <div className="summary-heading">
                    <Gift size={23} />

                    <h3>Order Summary</h3>
                  </div>

                  <div
                    className="summary-preview"
                    aria-hidden="true"
                  >
                    <div className="mini-card">
                      <img
                        src={wingsLogo}
                        alt=""
                        className="card-logo"
                      />

                      <div className="mini-card-bottom">
                        <small>GIFT CARD</small>

                        <strong>
                          {formatCurrency(giftCardAmount)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className="summary-details"
                    aria-live="polite"
                  >
                    <div className="summary-row">
                      <span>Gift Card Balance</span>

                      <strong>
                        {formatCurrency(giftCardAmount)}
                      </strong>
                    </div>

                    <div className="summary-row">
                      <span>Quantity</span>

                      <strong>
                        {validQuantity
                          ? numericQuantity
                          : "—"}
                      </strong>
                    </div>

                    <div className="summary-total">
                      <span>Total Gift Card Value</span>

                      <strong>
                        {formatCurrency(totalAmount)}
                      </strong>
                    </div>
                  </div>

                  <div className="summary-notice">
                    <ShieldCheck size={19} />

                    <p>
                      Payment will be arranged directly
                      with our team after your request
                      is submitted.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;