import React, { useEffect, useState } from "react";
import Container from "../../UserInterface/Container/Container";
import "./SearchBox.scss";
import axios from "axios";
import Card from "../../UserInterface/Container/Card/Card";
import { AiOutlineClose } from "react-icons/ai";
import Message from "../../UserInterface/Container/Message/Message";
import ReactTimeAgo from "react-time-ago";

const SearchBox = ({ placeholder, containerClasses, inputClasses }) => {
  const [cities, setCities] = useState();
  const [selectedCity, setSelectedCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formattedValues, setFormattedValues] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [cityAq, setCityAq] = useState([]);
  const [clickedSuggestion, setClickedSuggestion] = useState(null);

  useEffect(() => {
    const loadCities = async () => {
      const response = await axios.get(
        `https://docs.openaq.org/v2/latest?limit=1000&page=1&offset=0&sort=desc&radius=1000&country=gb&order_by=lastUpdated&dumpRaw=false`
      );
      setCities(response.data.results);
    };
    loadCities();
  }, []);

  useEffect(() => {
    const getLocationDetails = async () => {
      if (clickedSuggestion) {
        const response = await axios.get(
          `https://docs.openaq.org/v2/locations?limit=100&page=1&offset=0&sort=desc&radius=1000&location=${clickedSuggestion}&order_by=lastUpdated&dumpRaw=false`
        );
        let formattedValuesVar = "";
        const valuesArray = response && response?.data?.results[0]?.parameters;
        if (!valuesArray) {
          // if undefined or null, return and reset user feedback states
          setIsLoading(false);
          setHasError(true);
          return;
        }
        valuesArray.forEach((values, i) => {
          valuesArray.length === i + 1
            ? (formattedValuesVar += `${values.displayName}: ${values.lastValue}`)
            : (formattedValuesVar += `${values.displayName}: ${values.lastValue}, `);
        });

        setCityAq((oldArray) => [response.data.results[0], ...oldArray]);
        setFormattedValues(formattedValuesVar);
        setIsLoading(false);
        setHasError(false);
      }
    };
    getLocationDetails();
  }, [clickedSuggestion]);

  const onSearchCity = (inputValueCity) => {
    let matches = [];
    if (inputValueCity.length > 0) {
      matches = cities.filter((city) => {
        // so that filter works without case-sensetivity issues
        const regex = new RegExp(`${inputValueCity}`, "gi");
        return city.location && city.location.match(regex);
      });
    }
    setSuggestions(matches);
    setSelectedCity(inputValueCity);
  };

  const onSelectSuggestedCityHandler = (text) => {
    // so that user can not fetch the same city twice
    if (text === clickedSuggestion) {
      return;
    }

    setSelectedCity(text);
    setClickedSuggestion(text);
    setSuggestions([]);
    setIsLoading(true);
    setHasError(false);
  };

  const clearSelectedCityHandler = (cityNameToClear) => {
    setSelectedCity("");
    setClickedSuggestion("");
    setSuggestions([]);
    // use passed in argument to filter out cities to be cleared from cityAq state
    setCityAq((cities) =>
      cities.filter((city) => city.name !== cityNameToClear)
    );

    setIsLoading(false);
    setHasError(false);
  };

  return (
    <Container classes={containerClasses}>
      <div className="container__search-box">
        <input
          onChange={(e) => onSearchCity(e.target.value)}
          type="text"
          className={inputClasses}
          placeholder={placeholder}
          value={selectedCity}
        />
        <div className="container__suggestions">
          {suggestions &&
            suggestions.map((suggestion, i) => (
              <div
                className="suggestions"
                key={i}
                onClick={() =>
                  onSelectSuggestedCityHandler(suggestion.location)
                }
              >
                {suggestion.location}
              </div>
            ))}
        </div>
      </div>

      {isLoading && (
        <Message
          classes="tip text-align margin-t-lg"
          heading="Loading"
          summary="The data for your selected city is being fetched"
        />
      )}

      {hasError && (
        <Message
          classes="error text-align margin-t-lg"
          heading="Error"
          summary="No data to fetched, try searching for another location"
        />
      )}
      <div className="container__city-aq margin-t-lg">
        {cityAq &&
          cityAq.map((aq, i) => (
            <Card key={i} classes="margin-b-lg">
              <div
                className="card__close-card"
                onClick={() => clearSelectedCityHandler(aq.name)}
              >
                <AiOutlineClose />
              </div>
              <p className="uppercase small bold">
                Updated{" "}
                {aq ? (
                  <ReactTimeAgo
                    date={(aq?.parameters[0]?.lastUpdated).split("T")[0]}
                    locale="en-UK"
                  />
                ) : (
                  "a while ago"
                )}
              </p>
              <p className="purple bolder">{aq.name}</p>
              <p className="medium">
                in{" "}
                {aq.city ? `${aq.city}, United Kingdom` : "the United Kingdom"}
              </p>
              <p className="bold medium">Values: {formattedValues}</p>
            </Card>
          ))}
      </div>
    </Container>
  );
};

export default SearchBox;
