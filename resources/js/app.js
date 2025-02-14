import './bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'toastr/build/toastr.min.css';
import {createApp} from 'vue';
import Index from './components/index.vue';
import 'sweetalert2/src/sweetalert2.scss';
import store from './store.js';
import router from './router.js';
import 'dropify';
import 'dropify/dist/css/dropify.min.css';
import toastr from 'toastr';
// Changed to capital I for consistency
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/css/all.css'
import '@vueform/multiselect/themes/default.css';
import {ErrorMessage, Field, Form} from 'vee-validate';
import {useRoute} from "vue-router"; // Add this for form validation

// Configure toastr
toastr.options.newestOnTop = true;
toastr.options.closeButton = true;
toastr.options.timeOut = 5000;
window.toastr = toastr;

// Axios interceptor
axios.interceptors.response.use(
	response => response,
	async(error) => {
		if(error.response.status === 500){
			toastr.error('Something went wrong');
		}
		return Promise.reject(error);
	}
);


const app = createApp(Index);

// Register global components
app.component('Form', Form);
app.component('Field', Field);
app.component('ErrorMessage', ErrorMessage);

// Use plugins
app.use(store);
app.use(router);


// Mount the app
app.mount('#app');