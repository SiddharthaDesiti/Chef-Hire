import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaCreditCard, FaPaypal, FaWallet } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";

const Payments = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token, currencySymbol } = useContext(AppContext);
  
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [processingPayment, setProcessingPayment] = useState(false);

  const fetchBookingDetails = async () => {
    if (!token) {
      toast.error("Please login to view booking details");
      return navigate("/login");
    }
    
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/booking/${bookingId}`,
        { headers: { token } }
      );
      
      if (data.success) {
        setBookingDetails(data.booking);
      } else {
        toast.error(data.message || "Failed to fetch booking details");
        navigate("/mybookings");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error(error.response?.data?.message || "Failed to fetch booking details");
      navigate("/mybookings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  const validateCardDetails = () => {
    // Basic validation
    if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }
    
    if (!cardDetails.cardName.trim()) {
      toast.error("Please enter the cardholder name");
      return false;
    }
    
    if (!cardDetails.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      toast.error("Please enter expiry date in MM/YY format");
      return false;
    }
    
    if (!cardDetails.cvv.match(/^\d{3}$/)) {
      toast.error("Please enter a valid 3-digit CVV");
      return false;
    }
    
    return true;
  };

  const processPayment = async () => {
    if (paymentMethod === "card" && !validateCardDetails()) {
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data } = await axios.post(
        `${backendUrl}/api/user/process-payment`,
        { 
          bookingId,
          paymentMethod,
          ...(paymentMethod === "card" && { lastFourDigits: cardDetails.cardNumber.slice(-4) })
        },
        { headers: { token } }
      );
      
      if (data.success) {
        toast.success(data.message || "Payment successful!");
        navigate("/mybookings");
      } else {
        toast.error(data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(error.response?.data?.message || "Payment processing failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h1>
      
      {bookingDetails && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Booking Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 mb-1">Cook:</p>
              <p className="font-medium">{bookingDetails.cookName}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Date:</p>
              <p className="font-medium">{bookingDetails.bookingDate}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Time:</p>
              <p className="font-medium">{bookingDetails.bookingTime}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Amount:</p>
              <p className="font-medium text-primary">{currencySymbol}{bookingDetails.amount}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Payment Method</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div 
                className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                  paymentMethod === "card" ? "border-primary bg-primary/5" : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <FaCreditCard className={`text-xl ${paymentMethod === "card" ? "text-primary" : "text-gray-500"}`} />
                <span className={paymentMethod === "card" ? "text-primary font-medium" : "text-gray-700"}>Credit/Debit Card</span>
              </div>
              
              <div 
                className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                  paymentMethod === "paypal" ? "border-primary bg-primary/5" : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <FaPaypal className={`text-xl ${paymentMethod === "paypal" ? "text-primary" : "text-gray-500"}`} />
                <span className={paymentMethod === "paypal" ? "text-primary font-medium" : "text-gray-700"}>PayPal</span>
              </div>
              
              <div 
                className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                  paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("wallet")}
              >
                <FaWallet className={`text-xl ${paymentMethod === "wallet" ? "text-primary" : "text-gray-500"}`} />
                <span className={paymentMethod === "wallet" ? "text-primary font-medium" : "text-gray-700"}>Wallet</span>
              </div>
            </div>
            
            {paymentMethod === "card" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    maxLength="16"
                  />
                </div>
                
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={cardDetails.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      maxLength="5"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === "paypal" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
            )}
            
            {paymentMethod === "wallet" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800">
                  <span className="font-medium">Wallet Balance: {currencySymbol}500.00</span><br />
                  Amount will be deducted from your wallet balance.
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(`/bookings/${bookingDetails.cookId}`)}
                className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Booking
              </button>
              
              <button
                onClick={processPayment}
                disabled={processingPayment}
                className={`px-8 py-3 bg-primary rounded-full text-white flex items-center gap-2 transition-colors ${
                  processingPayment ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
                }`}
              >
                {processingPayment ? (
                  <>
                    <BiLoaderAlt className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;