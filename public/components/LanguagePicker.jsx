import React, { Component, PropTypes } from "react";
import { uniqBy } from 'lodash';

class LanguagePicker extends Component {
  render() {
    const { onPickerClick, onKeyPress, onPickerItemClick, onPickerBlur, data } = this.props;

    let firstItemTitle = (type => {
      switch (type) {
        case "foodTypes":
          return `${this.props.allowEdit ? ' Type or choose' : 'Choose'} from dropdown...`;
        case "languages":
          return "Choose a language...";
        case "categories":
          return "Choose a category...";
        case "branches":
          return "Choose a branch...";
        case "menus":
          return "Choose a menu...";
        case "cuisines":
          return "Choose a cuisine...";
        case "currencies":
          return "Choose a currency...";
        case "subscriptions":
          return "Choose a subscription...";
        default:
          return "Choose an item...";
      }
    })(data.type);

    const options =
      data.items && data.items.length > 0
        ? data.items.map((item, index) => {
            let finalCode = item.CodeFull ? item.CodeFull : item.Code;
            switch (data.type) {
              case "foodTypes":
                return item.Items ? (
                  <optgroup key={index} label={item.Group}>
                    {item.Items.map((group, index2) => (
                      <option value={group.Name} key={index2}>
                        {group.Name}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  <option value={item.Name} key={index}>
                    {item.Name}
                  </option>
                );
              case "languages":
                return (
                  <option value={finalCode} key={index}>
                    {item.Name}
                  </option>
                );
              case "cuisines":
                return (
                  <option value={item.Title} key={index}>
                    {item.Title}
                  </option>
                );
              case "currencies":
                return (
                  <option value={item.Name} key={index}>
                    {item.Name}
                  </option>
                );
              case "branches":
                return (
                  <option value={item.Name} key={index}>
                    {item.Name}
                  </option>
                );
              case "menus":
                return (
                  <option value={item.Title} key={index}>
                    {item.Title}
                  </option>
                );
              case "categories":
                return (
                  <option value={item.Title} key={index}>
                    {item.Title}
                  </option>
                );
              case "subscriptions":
                return (
                  <option value={item.title} key={index}>
                    {item.title}
                  </option>
                );
              default:
                return (
                  <option value={item.codeFull} key={index}>
                    {item.title}
                  </option>
                );
            }
          })
        : null;

    const selectOptions =
      data.items && data.items.length > 0
        ? data.items.map((item, index) => {
            let finalCode = item.CodeFull ? item.CodeFull : item.Code;
            switch (data.type) {
              case "foodTypes":
                return item.Items ? (
                  <li
                    key={index}
                    data-id={item.Group}
                    rel={item.Group}
                    className="select--options__group"
                  >
                    {item.Group}
                    <ol>
                      {item.Items.map((group, index2) => (
                        <li
                          data-id={group.Name}
                          rel={group.Name}
                          onClick={e => onPickerItemClick(e)}
                          key={index2}
                        >
                          {group.Name}
                        </li>
                      ))}
                    </ol>
                  </li>
                ) : (
                  <li
                    data-id={item.Name}
                    rel={item.Name}
                    onClick={e => onPickerItemClick(e)}
                    key={index}
                  >
                    {item.Name}
                  </li>
                );
              case "languages":
                return (
                  <li
                    data-id={item.LanguageID}
                    rel={finalCode}
                    onClick={e => onPickerItemClick(e)}
                    key={index}
                  >
                    {item.Name}
                  </li>
                );
              case "cuisines":
                return (
                  <li
                    data-id={item.CuisineID}
                    rel={item.Title}
                    onClick={e => onPickerItemClick(e)}
                    key={index}
                  >
                    {item.Title}
                  </li>
                );
              case "currencies":
                return (
                  <li
                    data-id={item.CurrencyID}
                    rel={item.Name}
                    onClick={e => onPickerItemClick(e)}
                    key={index}
                  >
                    {item.Name + " (" + item.Symbol + ")"}
                  </li>
                );
              case "branches":
                return (
                  <li
                    data-id={item.BranchID}
                    rel={item.Name}
                    onClick={e => onPickerItemClick(e)}
                    key={index}
                  >
                    {item.Name}
                  </li>
                );
              case "menus":
                return (
                  <li
                    data-id={item.MenuID}
                    rel={item.Title}
                    onClick={e => onPickerItemClick(e)}
                    key={index}
                  >
                    {item.Title}
                  </li>
                );
              case "categories":
                return (
                  <li
                    data-id={item.CategoryStandardID}
                    className={item.disabled ? "disable" : ""}
                    rel={item.Title}
                    onClick={e =>
                      !item.disabled ? onPickerItemClick(e) : null
                    }
                    key={index}
                  >
                    {item.Title}
                  </li>
                );
              default:
                return (
                  <li
                    data-id={item.id}
                    rel={item.codeFull}
                    onClick={e => onPickerItemClick(e)}
                    key={index}
                  >
                    {item.title}
                  </li>
                );
            }
          })
        : null;

    return (
      <div
        tabIndex={!this.props.allowEdit ? 1 : undefined}
        className="custom-select"
        onBlur={!this.props.allowEdit ? e => onPickerBlur(e) : undefined}
      >
        <select
          id="pick--language"
          className="select-hidden"
          onChange={e => onAdd()}
        >
          {options}
        </select>
        {this.props.allowEdit ? (
          <div className="select--styled text--select text--input" data-rel="en-gb">
            <input
              onBlur={e => onPickerBlur(e)}
							onClick={e => onPickerClick(e)}
							onKeyPress={e => onKeyPress(e)} 
              placeholder={firstItemTitle}
            />
          </div>
        ) : (
          <div
            className="select--styled text--select"
            data-rel="en-gb"
            onClick={e => onPickerClick(e)}
          >
            {firstItemTitle}
          </div>
        )}
        <ul className={`select--options ${this.props.className || ''}`}>{selectOptions}</ul>
      </div>
    );
  }
}

LanguagePicker.propTypes = {
  onPickerClick: PropTypes.func,
  onPickerItemClick: PropTypes.func,
  onPickerBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
  data: PropTypes.object,
  allowEdit: PropTypes.bool
};

export default LanguagePicker;
