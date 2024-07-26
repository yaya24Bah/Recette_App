document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const recipeForm = document.getElementById('recipe-form');
    const logoutButton = document.getElementById('logout-button');

    // Login Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Token received:', data.token);
            localStorage.setItem('token', data.token);
            console.log('Stored token:', localStorage.getItem('token'));

        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Recipe Form Submission
    recipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const ingredients = document.getElementById('ingredients').value.split(',').map(ingredient => ingredient.trim());
        const instructions = document.getElementById('instructions').value;

        try {
            console.log('Attempting to retrieve token from localStorage');
            const token = localStorage.getItem('token');
            console.log('Retrieved token:', token);

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('http://localhost:5000/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ title, description, ingredients, instructions }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            // Clear the form
            recipeForm.reset();

            // Reload the recipes
            loadRecipes();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // entrer les recettes
    const loadRecipes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recipes');
            const recipes = await response.json();

            const recipesContainer = document.getElementById('recipes');
            recipesContainer.innerHTML = '';

            recipes.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.classList.add('recipe');
                recipeElement.innerHTML = `
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description}</p>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                `;
                recipesContainer.appendChild(recipeElement);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    loadRecipes();

    // sortir
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        console.log('Token removed');
        // Redirect or update UI after logout
    });
});
