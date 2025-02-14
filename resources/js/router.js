import { createWebHistory, createRouter } from 'vue-router';
import store from './store.js';
import redirectToHome from './components/pages/redirectToHome.vue';
import Login from './components/pages/auth/login.vue';
import Register from './components/pages/auth/register.vue';
import proRegister from './components/pages/auth/proRegister.vue';
import verifyEmail from './components/pages/auth/verifyEmail.vue';
import verifyingEmail from './components/pages/auth/verifyingEmail.vue';
import emailPassword from './components/pages/auth/passwords/emailPassword.vue';
import resetPassword from './components/pages/auth/passwords/resetPassword.vue';

import github from './components/pages/auth/github.vue';
import google from './components/pages/auth/google.vue';
import adminHome from './components/pages/admin/adminHome.vue';

import userHome from './components/pages/user/userHome.vue';

import proHome from './components/pages/pro/proHome.vue';

import pageNotFound from './components/pages/errors/404.vue';



const routes = [
	{
		path: '/',
		name: 'Home',
		redirect: {
			name: 'login'
		},
		meta: {
			requiresAuth: undefined,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/redirect-to-welcome',
		name: 'redirectToHome',
		component: redirectToHome,
		meta: {
			requiresAuth: undefined,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/login',
		name: 'login',
		component: Login,  // Use the imported component
		meta: {
			requiresAuth: false,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/register',
		name: 'Register',
		component: Register,
		meta: {
			requiresAuth: false,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/pro-register',
		name: 'proRegister',
		component: proRegister,
		meta: {
			requiresAuth: false,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/verify-email',
		name: 'verifyEmail',
		component: verifyEmail,
		meta: {
			requiresAuth: undefined,
			isVerified: false,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/api/verify-email/:id/:hash',
		name: 'verifyingEmail',
		component: verifyingEmail,
		meta: {
			requiresAuth: true,
			isVerified: false,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/reset-password',
		name: 'emailPassword',
		component: emailPassword,
		meta: {
			requiresAuth: undefined,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/api/reset-password/:token',
		name: 'resetPassword',
		component: resetPassword,
		meta: {
			requiresAuth: undefined,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},

	{
		path: '/api/auth/github-callback',
		name: 'github',
		component: github,
		meta: {
			requiresAuth: undefined,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/api/auth/google-callback',
		name: 'google',
		component: google,
		meta: {
			requiresAuth: undefined,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/admin-home',
		name: 'adminDashboard',
		component: adminHome,
		meta: {
			requiresAuth: true,
			isVerified: true,
			isAdmin: true,
			isUser: false,
			isPro: false
		}
	},
	{
		path: '/admin/establishments',
		name: 'AdminEstablishments',
		component: () => import('./components/pages/admin/Establishment/EstablishmentList.vue'),
		meta: { requiresAuth: true, isAdmin: true },
	},
	{
		path: '/admin/establishments/create',
		name: 'CreateEstablishment',
		component: () => import('./components/pages/admin/Establishment/CreateEstablishment.vue'),
		meta: { requiresAuth: true, isAdmin: true },
	},

	{
		path: '/user-home',
		name: 'userDashboard',
		component: userHome,
		meta: {
			requiresAuth: true,
			isVerified: true,
			isUser: true,
			isAdmin: false,
			isPro: false
		}
	},

	{
		path: '/pro-home',
		name: 'proDashboard',
		component: proHome,
		meta: {
			requiresAuth: true,
			isVerified: true,
			isPro: true,
			isAdmin: false,
			isUser: false
		}
	},

	{
		path: '/:pathMatch(.*)*',
		name: '404',
		component: pageNotFound,
		meta: {
			requiresAuth: undefined,
			isVerified: undefined,
			isAdmin: undefined,
			isUser: undefined,
			isPro: undefined
		}
	},
	{
		path: '/admin',
		component: adminHome,
		meta: {
			requiresAuth: true,
			isVerified: true,
			isAdmin: true,
			isUser: false,
			isPro: false,
		},
		children: [
			{
				path: 'dashboard',
				name: 'adminDashboard',
				component: () => import('./components/pages/admin/Dashboard.vue'),
				meta: { requiresAuth: true, isAdmin: true },
			},
			{
				path: '/admin/accueil',
				name: 'AdminAccueil',
				component: () => import('./components/pages/admin/Accueil.vue'),
				meta: { requiresAuth: true, isAdmin: true },
			},
			{
				path: 'configuration',
				name: 'adminConfiguration',
				component: () => import('./components/pages/admin/Configuration.vue'),
				meta: { requiresAuth: true, isAdmin: true },
			},
		],
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes
});

// Define auth-free routes
const publicRoutes = ['login', 'Register', 'proRegister', 'emailPassword', 'resetPassword'];

router.beforeEach((to, from, next) => {
	console.group('Navigation Guard');
	console.log('To Route:', {
		name: to.name,
		path: to.path,
		fullPath: to.fullPath,
		params: to.params,
		meta: to.meta
	});
	console.log('Available Routes:', router.getRoutes().map(route => ({
		name: route.name,
		path: route.path
	})));
	const isAuthenticated = !!(localStorage.getItem('token') && store.getters.getToken);
	const userType = store.getters.getType;
	const isVerified = parseInt(store.getters.getVerified) !== 0;

	console.log('Navigation Details:', {
		route: to.name,
		isAuthenticated,
		userType,
		isPublicRoute: publicRoutes.includes(to.name)
	});



	// Specific handling for public routes
	if (publicRoutes.includes(to.name)) {
		// Redirect authenticated users to their dashboard
		if (isAuthenticated) {
			const dashboardMap = {
				'Admin': 'adminDashboard',
				'User': 'userDashboard',
				'Pro': 'proDashboard'
			};
			next({ name: dashboardMap[userType] || 'userDashboard' });
			return;
		}

		// Allow access to public routes
		next();
		return;
	}

	// Redirect unauthenticated users to login
	if (!isAuthenticated) {
		localStorage.setItem('redirectAfterLogin', to.fullPath);
		next({ name: 'login' });
		return;
	}

	// Verification check
	if (to.meta.isVerified === true && !isVerified) {
		next({ name: 'verifyEmail' });
		return;
	}



	// Role-based access control
	if (isAuthenticated) {
		const restrictionChecks = [
			{
				condition: to.meta.isAdmin === false && userType === 'Admin',
				route: 'adminDashboard'
			},
			{
				condition: to.meta.isUser === false && userType === 'User',
				route: 'userDashboard'
			},
			{
				condition: to.meta.isPro === false && userType === 'Pro',
				route: 'proDashboard'
			}
		];

		for (let check of restrictionChecks) {
			if (check.condition) {
				toastr.error('You are not allowed to perform this action');
				next({ name: check.route });
				return;
			}
		}
	}

	// Allow navigation
	next();
});

export default router;