import { answerInvitationRequest, getPremiumRequest } from '@the-ver-best-scrum-team/rest-api-client/requests';
import {client, actions} from '@the-ver-best-scrum-team/rest-api-client/restAPI'
var cloneDeep = require('lodash.clonedeep');

import { emulatedBoard } from './emulatedBoard';

const INITIAL_DATA_URL = "https://raw.githubusercontent.com/spympr/estimate-pi/master/temp.json"

import axios from "axios"



var verbose = 1;
var log = function(msg){
	if (1)
		console.log(msg);
}

var setToken = function(){
	var token = getters.token
	client.tokenObject.token = token
}

var setTokenProject = function(){
	var token = getters.token
	var projectLs = getters.project
	var projectsLs = getters.projects
	client.tokenObject.token = token
	client.project = { _id: projectLs._id }
	client.user.projects = projectsLs
}

export default {

	// async getEmulatedData({ commit, getters }) {
	// 	commit("SET_LOADING_STATE", true) 
	// 	// return axios.get(INITIAL_DATA_URL).then(res => {
	// 	// commit("SET_INITIAL_DATA", res.data)
	// 	// })
	// 	var myEmulatedBoard = cloneDeep(emulatedBoard) 
	// 	var token = getters.token
	// 	var projectLs = getters.project
	// 	var projectsLs = getters.projects
	// 	client.tokenObject.token = token
	// 	client.project = { _id: projectLs._id }
	// 	client.user.projects = projectsLs
		
	// 	console.log("GETT SPRITSSSS", client);
	// 	// add sprints
	// 	return actions.getSprints()
	// 	.then(response => {
	// 		console.log(response);
    //   		console.log(client);
	// 		commit("STORE_SPRINTS", client.project.sprints)
	// 		var sprints = getters.projectSprints
	// 		console.log("EDOOOOOO", sprints)
	// 		// if (sprints) {
	// 		// 	sprints.forEach(sprint => {
	// 		// 		myEmulatedBoard[0].lists.push( {id: new Date().getUTCMilliseconds(),
	// 		// 									name: sprint.name,
	// 		// 									headerColor: "#607d8b",
	// 		// 									archived: false,
	// 		// 									items: [],})
	// 		// 	});
	// 		// }
	// 		// commit("SET_INITIAL_DATA", myEmulatedBoard)
	// 		commit("SET_LOADING_STATE", false)
	// 	})
	// 	.catch( error => { 
	// 		log(error);
	// 		commit("SET_LOADING_STATE", false)
	// 		throw error;
	// 	})
	// },


	async login({ commit }, payload) {
		let username = payload.username 
		let password = payload.password 
		commit("SET_LOADING_STATE", true) 
		return actions.login(username, password) 
		.then( response => {
			console.log(response);
      		console.log(client);
			commit("STORE_CLIENT", client.user)
			commit("STORE_TOKEN", client.tokenObject.token)
			commit("SET_LOGEDIN_STATE", true)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})
	},

	async loginGoogle() {
		// commit("SET_LOADING_STATE", true) 
		return actions.loginGoogle() 
		.then( response => {
			console.log(response);
      		// console.log(client);
			// commit("STORE_CLIENT", client.user)
			// commit("STORE_TOKEN", client.tokenObject.token)
			// commit("SET_LOGEDIN_STATE", true)
			// commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			log(error);
			// commit("SET_LOADING_STATE", false)
			throw error;
		})
	},

	async loginGoogleAuthenticated({ commit }, code) {
		commit("SET_LOADING_STATE", true) 
		return actions.loginGoogleAuthenticated(code) 
		.then( response => {
			console.log(response);
      		console.log(client);
			commit("STORE_CLIENT", client.user)
			commit("STORE_TOKEN", client.tokenObject.token)
			commit("SET_LOGEDIN_STATE", true)
			commit("SET_LOADING_STATE", false)
		})
		.catch( error => { 
			console.log(error);
			console.log("error");
			commit("SET_LOADING_STATE", false)
			throw error;
		})
	},

	async logout({ commit, getters }, payload) {
		// Get client object
		var token = getters.token
		// log(token)
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.logout() 
		.then( response => {
			console.log(response);
			commit("DELETE_TOKEN")
			commit("DELETE_CLIENT")
			commit("DELETE_ALL_USERS")
			commit("DELETE_PROJECT")
			commit("DELETE_PROJECTS")
			commit("DELETE_COWORKERS")
			commit("DELETE_SPRINTS")
			commit("DELETE_USER_STORIES")
			commit("DELETE_INVITES")
			commit("SET_LOGEDIN_STATE", false)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})
	},

	async signup({ commit }, payload) {
		commit("SET_LOADING_STATE", true) 
		return actions.signup(payload) 
		.then( response => {
			console.log(response)
			log("USER HAS SIGNED IN!");
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			console.log("ERROR IN SIGNUP");
			commit("SET_LOADING_STATE", false)
			throw error
		}) 
	},

	
	async signupGoogle({ commit }, payload) {
		commit("SET_LOADING_STATE", true) 
		return actions.signupGoogle(payload) 
		.then( response => {
			console.log(response)
			console.log("USER HAS SIGNED IN!");
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			console.log("ERROR IN SIGNUP");
			commit("SET_LOADING_STATE", false)
			throw error
		}) 
	},

	async signupGoogleAuthenticated({ commit }, code) {
		commit("SET_LOADING_STATE", true) 
		console.log("NAIIIII", code)
		return actions.signupGoogleAuthenticated(code) 
		.then( response => {
			console.log("WORKEEED", code)
			console.log(response);
      		console.log(client);
			commit("STORE_CLIENT", client.user)
			commit("STORE_TOKEN", client.tokenObject.token)
			commit("SET_LOGEDIN_STATE", true)
			commit("SET_LOADING_STATE", false)
		})
		.catch( error => { 
			console.log(error);
			console.log("error");
			commit("SET_LOADING_STATE", false)
			throw error;
		})
	},


	async forgotPassword({ commit }, payload) {
		commit("SET_LOADING_STATE", true) 
		return actions.forgotPassword(payload)
		.then( response => {
			log(response)
			log("EMAIL RESETED");
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			log(error);
			log("ERROR IN EMAIL RESET");
			commit("SET_LOADING_STATE", false)
			throw error
		});
	},

	async getUser({ commit, getters }) {

		// Get client object
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.getUser() 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_CLIENT", client.user)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async getAllUsers({ commit, getters }) {

		// Get client object
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.getUsers() 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_ALL_USERS", response)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},


	async updateUserName({ commit, getters }, data) {

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.updateUser(data) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_CLIENT", client.user)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async updateFirstName({ commit, getters }, data) {

		// Get token
		var token = getters.token
		console.log(data)
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.updateUser(data) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_CLIENT", client.user)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async updateLastName({ commit, getters }, data) {

		// Get token
		var token = getters.token
		console.log(data)
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.updateUser(data) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_CLIENT", client.user)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async updateUserEmail({ commit, getters }, data) {

		// Get token
		var token = getters.token
		console.log(data)
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.updateUser(data) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("DELETE_TOKEN")
			commit("DELETE_CLIENT")
			commit("DELETE_ALL_USERS")
			commit("DELETE_PROJECT")
			commit("DELETE_PROJECTS")
			commit("DELETE_SPRINTS")
			commit("DELETE_USER_STORIES")
			commit("DELETE_COWORKERS")
			commit("DELETE_INVITES")
			commit("SET_LOGEDIN_STATE", false)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async resetPassword({ commit, getters }, data) {

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.resetPassword(data) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_CLIENT", client.user)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async deleteUser({ commit, getters }) {

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.deleteUser() 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("DELETE_TOKEN")
			commit("DELETE_CLIENT")
			commit("DELETE_ALL_USERS")
			commit("DELETE_PROJECT")
			commit("DELETE_PROJECTS")
			commit("DELETE_COWORKERS")
			commit("DELETE_SPRINTS")
			commit("DELETE_USER_STORIES")
			commit("DELETE_INVITES")
			commit("SET_LOGEDIN_STATE", false)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async getPremium({ commit, getters }, data) {

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.getPremium(data) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_CLIENT", client.user)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async addProject({ commit, getters }, data) {

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.addProject(data) 
		.then( response => {
			console.log(response);
      		console.log(client)
			// commit("STORE_PROJECT", client.project)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async createProjectAndInvite({ commit, getters }, data) {
		var inviteUsernameList = data.inviteUsernameList
		var project = data.project
		var totalResposnse = "";

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token

		// Create project
		return actions.addProject(project) 
		.then( response => {
			console.log(response);
      		console.log(client)
			totalResposnse += response
			
			// Get the project
			actions.getProjects() 
			.then( response => {
				actions.getProject(project.name).then( response => {
					console.log(response);
					console.log(client)
					commit("STORE_PROJECT", client.project)
					commit("STORE_SPRINTS", client.project.sprints)
					commit("STORE_USER_STORIES", client.project.userStories)
					commit("STORE_EMULATED_BOARD_DATA", cloneDeep(emulatedBoard) )
					commit("SET_ACTIVE_TASKBOARD", { board: getters.allBoards[0]}) //set active scrum boeard
				
					// Invite to project
					var data = {
						users: inviteUsernameList,
						project: getters.projectName
					};
					// Get token
					var token = getters.token
					var projectLs = getters.project
					var projectsLs = getters.projects
					client.tokenObject.token = token
					client.project = { _id: projectLs._id }
					client.user.projects = projectsLs			
					actions.inviteUser(getters.projectId, data) 
					.then( response => {
						console.log(response);
						console.log(client)
						totalResposnse += response + " "
						commit("SET_LOADING_STATE", false)
					})
					.catch( error => { 
						console.log(error);
						commit("SET_LOADING_STATE", false)
						throw error;
					})
				})
				.catch( error => {
					console.log(error);
					commit("SET_LOADING_STATE", false)
					throw error;
				})
			})
			.catch( error => { 
				console.log(error);
				commit("SET_LOADING_STATE", false)
				throw error;
			})

			commit("SET_LOADING_STATE", false)
			return totalResposnse
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})


	},

	async getProject({ commit, getters, dispatch }, data) {

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		client.user._id = getters._id

		return actions.getProjects() 
		.then( response => {
			actions.getProject(data).then( response => {
				console.log(response);
				console.log(client)
				commit("STORE_PROJECT", client.project)
				commit("STORE_SPRINTS", client.project.sprints)
				commit("STORE_USER_STORIES", client.project.userStories)
				commit("STORE_EMULATED_BOARD_DATA", cloneDeep(emulatedBoard))
				commit("STORE_EMULATED_KANBAN_BOARD", {myTasks:actions.getMyTasks(), boards:cloneDeep(emulatedBoard)})
				commit("SET_ACTIVE_TASKBOARD", { board: getters.allBoards[0]}) //set active scrum boeard
				commit("SET_LOADING_STATE", false)
			})
			.catch( error => {
				console.log(error);
				commit("SET_LOADING_STATE", false)
				throw error;
			})
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	getScrumBoard({ commit, getters }) {
		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs
		client.user._id = getters._id
		
		// client.project.userStories = getters.projectUserStories
		// client.project.sprints = getters.projectSprints
		commit("SET_LOADING_STATE", true)
		actions.getSprints()
		.then(response => {
			actions.getUserStories()
			.then(response => {
				commit("STORE_SPRINTS", client.project.sprints)
				commit("STORE_USER_STORIES", client.project.userStories)
				commit("STORE_EMULATED_BOARD_DATA", cloneDeep(emulatedBoard))
				commit("SET_LOADING_STATE", false)
			})
		})
	},


	getMyTasks({ commit, getters }) {
		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs

		client.project.userStories = getters.projectUserStories
		client.user._id = getters._id

		commit("SET_LOADING_STATE", true) 
		var myTasks = actions.getMyTasks()
		commit("STORE_EMULATED_KANBAN_BOARD", {myTasks:myTasks, boards:cloneDeep(emulatedBoard)} )
		console.log("MY TASKS ",myTasks)
		commit("SET_LOADING_STATE", false)

	},

	async getProjects({ commit, getters }) {

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.getProjects() 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_PROJECTS", client.user.projects)
			commit("STORE_COWORKERS")
			commit("SET_LOADING_STATE", false)
			// return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async getInvites({ commit, getters }) {

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.getInvitations() 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_INVITES", client.user.invitations)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},


	async inviteUsers({ commit, getters }, usernames) {

		var data = {
			users: usernames,
			project: getters.projectName
		};
		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = { _id: projectLs._id }
		client.user.projects = projectsLs

		commit("SET_LOADING_STATE", true) 
		return actions.inviteUser(getters.projectId, data) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async answerInvitation({commit, getters}, data) {

		// Get token
		var token = getters.token
		commit("SET_LOADING_STATE", true) 
		client.tokenObject.token = token
		return actions.answerInvitation(data.answer, data.invitationCode)
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("UPDATE_INVITE", data)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})
	},

	async editProject({ commit, getters }, projectData) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = { _id: projectLs._id }
		client.user.projects = projectsLs

		commit("SET_LOADING_STATE", true) 
		return actions.editProject(projectData) 
		.then( response => {
			actions.getProjectById(getters.projectId)
			.then( response => {
				console.log(response);
				console.log(client)
				commit("STORE_PROJECT", client.project)
				commit("SET_LOADING_STATE", false)
				return response
			})
			.catch( error => {
				console.log(error);
				console.log(client)
				commit("SET_LOADING_STATE", false)
				throw error;
			})
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async leaveProject({ commit, getters }, projectName) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = { _id: projectLs._id }
		client.user.projects = projectsLs
		
		commit("SET_LOADING_STATE", true) 
		return actions.leaveProject() 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("DELETE_PROJECT")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async deleteProject({ commit, getters }, projectName) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = { _id: projectLs._id }
		client.user.projects = projectsLs
		
		commit("SET_LOADING_STATE", true) 
		return actions.deleteProject() 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("DELETE_PROJECT")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async addSprint({ commit, getters, dispatch }, sprintData) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs
		
		commit("SET_LOADING_STATE", true) 
		return actions.addSprint(sprintData) 
		.then( response => {
			console.log(response);
      		console.log(client)
			// commit("STORE_PROJECT", client.project)
			commit("STORE_SPRINT", client.project.sprints[client.project.sprints.length-1])
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async editSprint({ commit, getters, dispatch }, sprintData) {
		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs

		// // get sprint
		// var sprint = getters.projectSprints.find(s => s._id === sprintData._id)
		// // edit sprint
		// sprint.name = sprintData.name;
		// sprint.description = sprintData.description;
		// sprint.duration = sprintData.estimated_duration;
		// sprint.status = sprintData.status;
		
		commit("SET_LOADING_STATE", true) 
		return actions.editSprint(JSON.parse(JSON.stringify(sprintData))) 
		.then( response => {
			console.log(response);
      		console.log(client)
			// commit("STORE_PROJECT", client.project)
			commit("STORE_SPRINT", sprintData)
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async getSprints({ commit, getters }) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs
		
		commit("SET_LOADING_STATE", true) 
		return actions.getSprints() 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_SPRINTS", client.project.sprints)
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async deleteSprint({ commit, getters, dispatch }, sprintId) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs
		
		commit("SET_LOADING_STATE", true) 
		return actions.deleteSprint({_id:sprintId}) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("DELETE_SPRINT", sprintId)
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async addUserStory({ commit, getters, dispatch }, userStoryData) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs
		
		commit("SET_LOADING_STATE", true) 
		return actions.addUserStory(userStoryData) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_USER_STORY", client.project.userStories[client.project.userStories.length-1])
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async editUserStory({ commit, getters, dispatch }, userStoryData) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs

		// // get user story
		// var userStory = getters.projectUserStories.find(s => s._id === userStoryData._id)
		// // edit user story
		// userStory.name = userStoryData.name;
		// userStory.description = userStoryData.description;
		// userStory.duration = userStoryData.estimated_duration;
		// userStory.status = userStoryData.status;
		// userStory.label = userStoryData.label;
		
		commit("SET_LOADING_STATE", true) 
		return actions.editUserStory(JSON.parse(JSON.stringify(userStoryData))) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_USER_STORY", userStoryData)
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async deleteUserStory({ commit, getters, dispatch }, userStoryId) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs
		
		commit("SET_LOADING_STATE", true) 
		console.log(userStoryId)
		return actions.deleteUserStory({_id:userStoryId}) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("DELETE_USER_STORY", userStoryId)
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async getUserStories({ commit, getters, dispatch }) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs
		
		commit("SET_LOADING_STATE", true) 
		return actions.getUserStories() 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_USER_STORIES", client.project.userStories)
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async addTask({ commit, getters, dispatch }, taskData) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs

		// add User Story
		client.project.userStories = getters.projectUserStories
		var taskList = client.project.userStories.find(us => us._id === taskData.userStory).tasks

		console.log(taskData)
		commit("SET_LOADING_STATE", true) 
		return actions.addTask(taskData) 
		.then( response => {
			console.log(response);
			console.log(client)
			commit("STORE_TASK", taskList[taskList.length -1])
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async addTaskAndConnectSprint({ commit, getters, dispatch }, taskConnectData) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs

		// add User Story
		client.project.userStories = getters.projectUserStories
		client.project.sprints = getters.progectSprints

		var taskData = taskConnectData.task
		var sprintName = taskConnectData.sprintName
		var taskList = client.project.userStories.find(us => us._id === taskData.userStory).tasks

		console.log(taskData)
		commit("SET_LOADING_STATE", true) 
		return actions.addTask(taskData) 
		.then( response => {

			dispatch("connectSprint", {taskName:taskData.name, sprintName:sprintName})
			.then(response => {
				console.log(response);
				console.log(client)
				commit("STORE_TASK", taskList[taskList.length -1])
				dispatch("getScrumBoard")
				commit("SET_LOADING_STATE", false)
				return response
			})
			.catch( error => { 
				console.log(error);
				commit("SET_LOADING_STATE", false)
				throw error;
			})
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async editTask({ commit, getters, dispatch }, taskData) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs

		// add User Story
		client.project.userStories = getters.projectUserStories

		// // get task
		// var taskList = getters.projectUserStories.find(us => us._id === taskData.userStory).tasks
		// var task = taskList.find(tsk => tsk._id === taskData._id)

		// // edit task
		// task.name = taskData.name
        // task.description = taskData.description
        // task.status = taskData.status
        // task.estimated_duration = taskData.estimated_duration

		commit("SET_LOADING_STATE", true) 
		return actions.editTask(JSON.parse(JSON.stringify(taskData))) 
		.then( response => {
			console.log(response);
			console.log(client)
			commit("STORE_TASK", taskData)
			dispatch("getScrumBoard")
			dispatch("getMyTasks")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			dispatch("getMyTasks")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async deleteTask({ commit, getters, dispatch }, taskId) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs

		// add User Story
		client.project.userStories = getters.projectUserStories
		
		commit("SET_LOADING_STATE", true) 
		return actions.deleteTask({_id:taskId}) 
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_USER_STORIES", client.project.userStories)
			commit("DELETE_TASK", taskId)
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async connectSprint({ commit, getters, dispatch }, connectData) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs

		// add User Story
		client.project.userStories = getters.projectUserStories
		client.project.sprints = getters.progectSprints

		// get task
		var task = getters.getTaskbyName(connectData.taskName)

		// get sprint
		var sprint = getters.getSprintbyName(connectData.sprintName)

		
		commit("SET_LOADING_STATE", true) 
		return actions.connectSprint(task, sprint)
		.then( response => {
			console.log(response);
      		console.log(client)
			commit("STORE_TASK_TO_SPRINT", {task:task, sprint:sprint})
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async disconnectSprint({ commit, getters, dispatch }, connectData) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs

		// add User Story
		client.project.userStories = getters.projectUserStories
		client.project.sprints = getters.progectSprints

		// get task
		var task = getters.getTaskbyName(connectData.taskName)


		commit("SET_LOADING_STATE", true) 
		return actions.disconnectSprint(task)
		.then( response => {
			console.log(response);
      		console.log(client)
			// commit("STORE_TASK_TO_SPRINT", {task:task, sprint:sprint})
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async joinTask({ commit, getters, dispatch }, taskId) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs
		client.user._id = getters._id

		// add User Story
		client.project.userStories = getters.projectUserStories
		client.project.sprints = getters.progectSprints

		// get task
		var task = getters.getTaskbyId(taskId)

		// check if user already exists in this task
		var taskMembers = getters.getTaskMembersbyId(taskId)
		if (taskMembers.includes(getters.userName))
			return
	
		
		commit("SET_LOADING_STATE", true) 
		return actions.joinTask(task)
		.then( response => {
			console.log(response);
      		console.log(client)
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},


	async leaveTask({ commit, getters, dispatch }, taskId) {

		// Get token
		var token = getters.token
		var projectLs = getters.project
		var projectsLs = getters.projects
		client.tokenObject.token = token
		client.project = projectLs
		client.user.projects = projectsLs
		client.user._id = getters._id

		// add User Story
		client.project.userStories = getters.projectUserStories
		client.project.sprints = getters.progectSprints

		// get task
		var task = getters.getTaskbyId(taskId)
	
		
		commit("SET_LOADING_STATE", true) 
		return actions.leaveTask(task)
		.then( response => {
			console.log(response);
      		console.log(client)
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			return response
		})
		.catch( error => { 
			console.log(error);
			dispatch("getScrumBoard")
			commit("SET_LOADING_STATE", false)
			throw error;
		})

	},

	async putSprintInFront({ commit, getters }, sprintName) {
		// get Sprint id
		var sprintId = getters.getSprintbyName(sprintName)._id
		commit("PUT_SPRINT_IN_FRONT", sprintId)
	},



	async changeTasksState({ commit }, payload) {
		commit("CHANGE_TASKS_STATE", payload)
	},

	async saveTaskBoard({ commit }, payload) {
		commit("SAVE_TASKBOARD", payload)
	},
	async archiveTaskBoard({ commit }, payload) {
		commit("ARCHIVE_TASKBOARD", payload)
	},
	async restoreTaskBoard({ commit }, payload) {
		commit("RESTORE_TASKBOARD", payload)
	},
	async setActiveTaskBoard({ commit }, payload) {
		commit("SET_ACTIVE_TASKBOARD", payload)
	},
	async restoreTaskList({ commit }, payload) {
		commit("RESTORE_TASKLIST", payload)
	},
	
	// usefull methods
	async saveTaskList({ commit }, payload) {
		// commit("SAVE_TASKLIST", payload)
	},
	async archiveTaskList({ commit }, payload) {
		commit("ARCHIVE_TASKLIST", payload)
	},
	async reorderTaskLists({ commit }, payload) { // maybe usefull for the backlog
		commit("REORDER_TASKLISTS", payload)
	},
	async reorderTaskListItems({ commit, getters, dispatch }, payload) {
		
		const board = getters.allBoards.find(b => b.id == payload.boardId)
		const listIdx = board.lists.findIndex(l => l.id == payload.listId)
		
		// get items that have changed
		var listBefore = board.lists[listIdx].items
		var listBeforeId = board.lists[listIdx].id
		var listAfter  = payload.items
		var listAfterId  = payload.listId
		const listId = payload.listId

		var listBeforeIds = listBefore.map(o => o.id)
		var listAfterIds  = listAfter.map(o => o.id)
		// console.log(listBeforeIds)
		// console.log(listAfterIds)

		var idThatMoved = listAfterIds.filter(x => !listBeforeIds.includes(x))
		var idThatleft = listBeforeIds.filter(x => !listAfterIds.includes(x))
		
		// check if it is a task in sprints ar in kanban todo
		// reorder behaviour in kanban
		if (payload.boardId === "KANBAN_BOARD" && idThatMoved.length) {
			// find the task
			var task = getters.getTaskbyId(idThatMoved[0])
			
			// edit to do task
			if (listId === "To do Id") {				
				task.status = "toDo"
			} else if (listId ===  "Doing Id") {
				task.status = "inProgress"
			} else if (listId ===  "Done Id") {
				task.status = "done"
			}
			
			// send edit request
			dispatch("editTask", task)
			.then(reaponse => {

				commit("REORDER_TASKLIST_ITEMS", payload)
			})
			
			
		} 
		// reorder behaviour in scrum board
		else if (payload.boardId === "SCRUM_BOARD") {
			
			// find if task or user story
			var item = {item:""}
			var id
			var listNow
			if (idThatMoved.length) {
				id = idThatMoved[0]
				listNow = listAfter
				item = getters.getTaskbyId(id)
				if (item === null)
					item = getters.getUserStorybyId(id)
				// get the state
				item["state"] = listNow.find(item => item.id === id).state
			} else if (idThatleft.length) {
				id = idThatleft[0]
				listNow = listBefore
				item = getters.getTaskbyId(id)
				if (item === null)
					item = getters.getUserStorybyId(id)
				// get the state
				item["state"] = listNow.find(item => item.id === id).state
			} 
			
			// nothing leaves or enters scrum board
			if (item.state === "taskInSprint"  && listBeforeId !== "Product Backlog id" && listAfterId !== "Product Backlog id") {

				// get names if task and sprint
				var taskName = item.name
				var connectSprintName = getters.getSprintbyId(listAfterId).name
				var disconnectSprintName = getters.getSprintbyId(item.sprint).name

				if (idThatMoved.length) {
					// console.log("DISCONNNECT", taskName, disconnectSprintName)
					// console.log("CONNNECT", taskName, connectSprintName)

					dispatch("disconnectSprint", {taskName:taskName})
					.then(response => {
						dispatch("connectSprint", {taskName:taskName, sprintName:connectSprintName})
						.then(response => {

							commit("REORDER_TASKLIST_ITEMS", payload)
						})
					})
				} 
				// else if (idThatleft.length){
				// 	console.log("DISCONNNECT", taskName, item.sprint, getters.getSprintbyId(listAfterId)._id)


				// 	commit("REORDER_TASKLIST_ITEMS", payload)
				// }

			}
		} 
		
	},
	async saveTaskListItem({ commit }, payload) {
		commit("SAVE_TASKLIST_ITEM", payload)
	},
	async deleteTaskListItem({ commit }, payload) {
		commit("DELETE_TASKLIST_ITEM", payload)
	}


}
