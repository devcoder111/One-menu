import React, { Component, PropTypes } from 'react';

import MealEdit from './MealEdit';

let createHandlers = (ctx) => {
	let lastSelectedMeal = 1;
	let onAdd = (data) => {
    console.log('onAdd', data);
    // return
		ctx.setState((prevState) => {
			console.log('allMeals', prevState.allMeals);
			let meals = prevState.allMeals;

			/*
			if (prevState.allMeals.length > 0) {
				nextID = parseInt(prevState.allMeals[prevState.allMeals.length - 1].id, 10) + 1;
			}
			*/


			let obj = data && data.menu && data.menu.MenuID === -1 && data.meal
        ? {
          id: lastSelectedMeal,
          catId: data.category.CategoryID,
          Title: data.meal.title || "",
          Description: data.meal.description || "",
          Price: data.meal.price || null,
          Images:[],
          FoodTypes: data.meal.foodTypes || [],
          enableDetails: data.meal.enableDetails || false,
          detail: data.meal.details || {},
          onRemove: onRemove
        }
        : {
				id: lastSelectedMeal,
				catId: ctx.props.category.id,
				title: "",
				description: "",
				price: null,
				images:[],
				foodTypes:[],
				enableDetails: false,
				detail: {},
				onRemove: onRemove
			};

			lastSelectedMeal++;

			console.log('obj', obj);

			meals.push(obj);

			ctx.props.onChange({
				catId: ctx.props.category.id,
				title: ctx.props.category.title,
				meals: meals
			});

			return {
				allMeals: meals
			}
		});
	};

	let onChange = (obj) => {
		console.log('meals onChange' ,obj);
		ctx.setState((prevState) => {
			// console.log(prevState.allMeals);

			//ctx.props.category.id === obj.catId

			let meals = prevState.allMeals.map((meal) => {
        console.log('meal map', meal)
				if ((ctx.props.category.id === obj.catId && (meal.id === obj.id || meal.MealID === obj.id))
					|| ((meal.id === 1 || meal.MealID === 1) && prevState.allMeals.length === 1)) {
					let tmp = meal;
					tmp.MealID = obj.id || obj.MealID;
					tmp.catId = obj.catId;
					tmp.Title = obj.title || obj.Title;
					tmp.FoodTypes = obj.foodTypes || obj.FoodTypes;
					tmp.images = obj.images;
					tmp.Description = obj.description || obj.Description;
					tmp.Price = parseFloat(obj.price) || null;
					console.log('tmp map', tmp)
					return tmp;
				}
				/*
				if (meal.id === obj.id || meal.id === 1) {
					let tmp = meal;
					tmp.title = obj.title;
					tmp.description = obj.description;
					tmp.price = parseFloat(obj.price) || null;
					return tmp;
				}
				*/

				return meal;
			}, []);

			// console.log(prevState.allMeals);

			console.log('updated meals', meals);

			// console.log(ctx.props.category.title);

			ctx.props.onChange({
				catId: ctx.props.category.id,
				title: ctx.props.category.title,
				meals: meals
			});

			return {
				allMeals: meals
			}
		});
	};

	let onRemove = (obj) => {
		ctx.setState((prevState) => {
			let meals = prevState.allMeals.reduce((acc, current) => {
				// console.log(current, obj)
				return ((current.id || current.MealID) !== obj.id) ? acc.concat([current]) : acc;
			}, []);

			// console.log(prevState.allMeals);

			// console.log(meals , 'meals test');

			ctx.props.onChange({
				catId: ctx.props.category.id,
				title: ctx.props.category.title,
				meals: meals
			});

			return {
				allMeals: meals
			}
		});
	};

	return {
		onAdd,
		onRemove,
		onChange
	};
};

class MealsEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allMeals: props.meals
		};
		this.handlers = createHandlers(this);
	}

	componentWillReceiveProps(nextProps, prevProps) {
		if (nextProps.meals !== prevProps.meals) {
			// console.log(nextProps.meals, 'nextProps.meals');
		}
	}

	render() {
		const { meals, onChange, category, menuCategories } = this.props;
    // console.log('meals', meals, this.state.allMeals)
		const mealComponents = (this.state.allMeals && this.state.allMeals.length > 0) ? this.state.allMeals.map((meal, index) => {
			return <MealEdit
				id={meal.id || meal.MealID} 
				catId={category.id} 
				title={meal.title || meal.Title} 
				description={meal.description || meal.Description}
				price={meal.price || meal.Price}
				images={meal.images || meal.Images} 
				foodTypes={meal.foodTypes || meal.FoodTypes} 
				enableDetails={meal.enableDetails} 
				detail={meal.detail} 
				onChange={this.handlers.onChange} 
				onRemove={this.handlers.onRemove}
				// onAddMeal={this.handlers.onAdd}
				onCloneMeal={this.props.onCloneMeal}
				menuCategories={menuCategories}
				key={index} />;
		}) : null;

		return (
			<div>
				{mealComponents}
				<div className="branch--add meal--add">
                	<div onClick={(e) => this.handlers.onAdd()}>
						<div className="add-item dashed">
							<span>Choose a Meal <strong>+</strong></span>
						</div>
					</div>
                </div>
			</div>
		);
	}
};

MealsEdit.propTypes = {
	meals: PropTypes.array,
	onChange: PropTypes.func,
	category: PropTypes.object
};

export default MealsEdit;
