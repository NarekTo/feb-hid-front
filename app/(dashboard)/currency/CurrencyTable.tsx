"use client";

import React, { useEffect, useState } from "react";
import MainButton from "../../components/UI_ATOMS/MainButton";
import TitleHeader from "../../components/UI_SECTIONS/page/TitleHeader";
import { useSession } from "next-auth/react";
import { Session } from "../../types";
import { deleteCurrency, postNewCurrency } from "../../utils/api";
import { MainListBox } from "../../components/UI_ATOMS/MainListBox";
import { currency_info } from "../../utils/constants";
import { MdClose } from "react-icons/md";

const CurrencyTable = ({ currency }) => {
  const { data: session } = useSession() as { data: Session | null };
  const [currencyData, setCurrencyData] = useState([]);
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState("SAR"); // Default to SAR
  const [showPopup, setShowPopup] = useState(false);
  const [newCurrency, setNewCurrency] = useState({
    currency_code: "SAR",
    currency_description: currency_info["SAR"].description,
    currency_symbol: currency_info["SAR"].symbol,
    country_code: currency_info["SAR"].countryCode,
  });
  const [currencyOptions, setCurrencyOptions] = useState(
    currency.map((info) => ({
      id: info.currency_code,
      name: `${info.currency_code} - ${info.currency_description}`,
    }))
  );

  const handleBaseCurrencyChange = (selectedOption) => {
    setBaseCurrency(selectedOption.id);
    // Automatically set the new currency details based on the selection
    const currencyDetails = currency_info[selectedOption.id];
    if (currencyDetails) {
      setNewCurrency({
        currency_code: selectedOption.id,
        currency_description: currencyDetails.description,
        currency_symbol: currencyDetails.symbol,
        country_code: currencyDetails.countryCode,
      });
    }
  };

  const handleAddCurrencyClick = () => {
    setShowPopup(!showPopup);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "currency_code") {
      const currencyDetails = currency_info[value];
      if (currencyDetails) {
        setNewCurrency({
          ...newCurrency,
          currency_code: value,
          currency_description: currencyDetails.description,
          currency_symbol: currencyDetails.symbol,
          country_code: currencyDetails.countryCode,
        });
      }
    } else {
      setNewCurrency({ ...newCurrency, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await postNewCurrency(newCurrency, session);

    if (success) {
      console.log("Item added successfully", success);
      setShowPopup(false);
      setCurrencyData((currentData) => [...currentData, success]);
      fetchExchangeRates();
      // The currencyData state is already updated with the optimistic update
      setCurrencyOptions((currentOptions) => [
        ...currentOptions,
        {
          id: newCurrency.currency_code,
          name: `${newCurrency.currency_code} - ${newCurrency.currency_description}`,
        },
      ]);
    }
  };

  const handleDeleteCurrency = async (currencyCode) => {
    setCurrencyData((currentData) =>
      currentData.filter((currency) => currency.currency_code !== currencyCode)
    );

    const success = await deleteCurrency(currencyCode, session);
    if (success) {
      setCurrencyOptions((currentOptions) =>
        currentOptions.filter((option) => option.id !== currencyCode)
      );
    }
  };

  const fetchExchangeRates = () => {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.result === "success") {
          console.log("data", data);
          const codes = Object.keys(data.conversion_rates);
          setCurrencyCodes(codes);
          const currencyDate = new Date(
            data.time_last_update_unix * 1000
          ).toLocaleDateString();
          const rates = data.conversion_rates;
          const currencyDescriptionMap = new Map(
            currency.map((info) => [
              info.currency_code,
              info.currency_description,
            ])
          );

          const processedData = Object.keys(rates).map((code) => ({
            currency_code: code,
            currency_name: currencyDescriptionMap.get(code) || "Unknown",
            exchange_rate: rates[code],
            currency_date: currencyDate,
          }));

          setCurrencyData(processedData);
        } else {
          console.error("Failed to fetch exchange rates:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    fetchExchangeRates();
  }, [baseCurrency]);

  return (
    <div className="w-full h-full flex flex-col">
      <TitleHeader firstLabel="Currency" firstValue="Table" />
      <div className="flex">
        <div className="mb-2 flex items-center pl-2 ">
          <label htmlFor="baseCurrencySelect" className="w-32">
            Base Currency:
          </label>
          <MainListBox
            list={currencyOptions}
            displayKey="name"
            setSelectedProject={handleBaseCurrencyChange} // Ensure this prop name matches what MainListBox expects for handling selection
            selected={currencyOptions.find(
              (option) => option.id === baseCurrency
            )}
          />
        </div>
        <div className="w-full flex gap-2 justify-end p-2">
          <MainButton fun={handleAddCurrencyClick} title="Add Currency" />
        </div>
      </div>
      {showPopup && (
        <div className="bg-slate-200 p-2 rounded-md m-2">
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-between"
          >
            <div className="flex">
              <label className="pr-2">
                Currency Code:
                <select
                  className="w-16 rounded-md mx-4 font-semibold"
                  name="currency_code"
                  value={newCurrency.currency_code}
                  onChange={handleInputChange}
                  required
                >
                  {currencyCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-md ">
                Description:
                <span className="font-semibold pr-6 pl-1">
                  {newCurrency.currency_description || ""}
                </span>
              </p>
              <p className="text-md">
                Currency Symbol:
                <span className="font-semibold pr-6 pl-1">
                  {" "}
                  {newCurrency.currency_symbol || ""}
                </span>{" "}
              </p>
              <p className="text-md">
                Country Code:
                <span className="font-semibold pr-6 pl-1">
                  {newCurrency.country_code || ""}
                </span>
              </p>
            </div>
            <MainButton title="Submit" type="submit">
              Submit
            </MainButton>
          </form>
        </div>
      )}

      <div className="h-full w-full   p-2 rounded-md">
        <table className="text-left text-sm font-light table-auto w-full ">
          <thead className="bg-dark-blue text-white sticky top-0 w-full rounded-md">
            <tr>
              <th className="px-2 py-1 font-medium tracking-wide whitespace-nowrap">
                Currency Code
              </th>
              <th className="px-2 py-1 font-medium tracking-wide whitespace-nowrap">
                Currency Name
              </th>
              <th className="px-2 py-1 font-medium tracking-wide whitespace-nowrap">
                Exchange Rate
              </th>
              <th className="px-2 py-1 font-medium tracking-wide whitespace-nowrap">
                Currency Date
              </th>
              <th className="px-2 py-1 font-medium tracking-wide whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody className="max-h-full overflow-y-auto overflow-scroll w-full">
            {currencyData
              .filter((item) => item.currency_name !== "Unknown")
              .map((item, index) => (
                <tr className="border-b dark:border-neutral-500" key={index}>
                  <td className="px-2 py-1 font-normal">
                    {item.currency_code}
                  </td>
                  <td className="px-2 py-1 font-normal">
                    {item.currency_name}
                  </td>
                  <td className="px-2 py-1 font-normal">
                    {item.exchange_rate}
                  </td>
                  <td className="px-2 py-1 font-normal">
                    {item.currency_date}
                  </td>
                  <td className="">
                    {item.currency_code !== "SAR" && (
                      <button
                        onClick={() => handleDeleteCurrency(item.currency_code)}
                        className="text-red-500 hover:text-red-700 flex items-center justify-center h-full"
                      >
                        <MdClose size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrencyTable;
