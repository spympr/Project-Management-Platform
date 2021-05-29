'use strict'

const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const moment = require("moment");

// Import Project model
const Project = require("../models/Project");
const { User } = require("../models/User");
const { projectDetailsSerializer, sprintSerializer, userStorySerializer, taskSerializer } = require("../serializers/projects");
const UserStory = require("../models/UserStory");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({});
    context = []
    for (let i in projects) {
      context.push(projectDescriptionSerializer(projects[i]))
    }

    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

// Create project
router.post("/", async (req, res) => {
  try {
    const user = req.user;
    // console.log(user)
    const project = new Project(req.body);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }
    project.productOwner = user._id;
    project.scrumMaster = user._id;
    project.members = [user._id];
    project.sprints = [];
    project.userStories = [];
    project.plan_in_use = req.body.plan_in_use == 'premium' && user.plan_in_use == 'premium' ? req.body.plan_in_use : 'standard';
    const savedProject = await project.save();
    
    // Add new project to user's projects
    user.projects.push(savedProject._id);
    await User.findByIdAndUpdate(user.id, user, { runValidators: true, new: true });
    
    const context = projectDetailsSerializer(savedProject);
    res.json(context);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error });
  }
})

// Delete specific project
router.delete('/:projectId', async (req, res) => {
  try {
    const user = req.user;
    // Find project in the db
    const project = await Project.findById(req.params.projectId);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }

    // Check if is the product owner is the user that sends the request
    if (user._id === project.productOwner){
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    // Remove project from user's projects list
    user.projects = user.projects.filter((pID) => { return pID !== req.params.projectId });

    // Update user's info
    await User.findByIdAndUpdate(user.id, user, { runValidators: true, new: true });

    // Remobe project from its table
    const removedProject = await Project.deleteOne({ _id: req.params.projectId });

    const context = projectDetailsSerializer(removedProject);
    res.json(context);
  } catch (err) {
    return res.status(400).json({ message: err });
  }

})

// Update specific project
router.patch('/:projectId', async (req, res) => {
  try {
    const user = req.user;
    const project = await Project.findById(req.params.projectId);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }

    // Check if is the product owner is the user that sends the request
    if (user._id === project.productOwner){
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    if (req.body.status == 'done' && req.body.status != project.status) {
      req.body.endingDate = Date.now();
    }
    if (req.body.plan_in_use && req.body.plan_in_use != project.plan_in_use) {
      project.plan_in_use = req.body.plan_in_use == 'premium' && user.plan_in_use == 'premium' ? req.body.plan_in_use : 'standard';
      if (req.body.plan_in_use == 'premium' && user.plan_in_use != 'premium') {
        return res.status(400).json({ message: "Can\'t update project to premium, if you have not unlocked the premium plan." });
      }
    }
    if (req.body.scrumMaster && req.body.scrumMaster != project.scrumMaster) {
      const scrumMaster = await User.findById(req.body.scrumMaster);
      // If no such project found
      if(!scrumMaster) {
        return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε ο νέος scrum master.' });
      }
      if (!project.members.includes(req.body.scrumMaster)) {
        return res.status(400).json({ message: 'Σφάλμα: Ο νέος scrum master δεν είναι μέλος της ομάδας.' });
      }
    }
    if (req.body.productOwner && req.body.productOwner != project.productOwner) {
      const productOwner = await User.findById(req.body.productOwner);
      // If no such project found
      if(!productOwner) {
        return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε ο νέος product owner.' });
      }
      if (!project.members.includes(req.body.productOwner)) {
        return res.status(400).json({ message: 'Σφάλμα: Ο νέος product owner δεν είναι μέλος της ομάδας.' });
      }
    }

    delete req.body.sprints;
    delete req.body.userStories;
    const updatedProject = await Project.findByIdAndUpdate(req.params.projectId, req.body, { runValidators: true, new: true });

    const context = projectDetailsSerializer(updatedProject);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

// Get all projects
router.post("/get-sprints", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }

    for (let i in project.sprints) {
      let members = []
      for (let j in project.sprints[i].members) {
        members.push(project.sprints[i].members[j].username)
      }
      project.sprints[i].members = members
    }
    
    context = sprintSerializer(project.sprints);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

// Get all projects
router.post("/get-userstories", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }

    context = userStorySerializer(project.userStories);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

// Get all projects
router.post("/get-details", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }

    context = projectDetailsSerializer(project);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

// ADD USERSTORY/ SPRINT/ TASK

router.post("/add-userstory", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }

    // Check if user is authorized for that action
    const user = req.user;
    if (project.productOwner !== user._id) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    const userStory = new UserStory(req.body.userStory);
    userStory.tasks = []
    userStory.sprints = []
    const savedUserStory = await userStory.save();
    project.userStories.push(savedUserStory._id);

    context = userStorySerializer(savedUserStory);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

router.post("/add-sprint", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }

    // Check if user is authorized for that action
    const user = req.user;
    if (project.productOwner !== user._id) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    const sprint = new Sprint(req.body.sprint);
    sprint.tasks = []
    const savedSprint = await sprint.save();
    project.sprints.push(savedSprint._id);

    context = sprintSerializer(savedSprint);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

router.post("/add-task", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }

    // Check if user is authorized for that action
    const user = req.user;
    if (!project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    const userStory = await UserStory.findById({name: req.body.userStory});
    // If no such userStory found
    if(!userStory) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το user story.' });
    }

    const task = new Task(req.body.task);
    var sprint = null;
    if (savedTask.sprint) {
      sprint = await Sprint.findById(req.body.task.sprint);
      // If no such sprint found
      if(!sprint) {
        return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το sprint.' });
      }
    }
    task.members = [user._id];
    const savedTask = await task.save();
    if (sprint) sprint.tasks.push(savedTask._id)
    userStory.tasks.push(savedTask._id)

    context = taskSerializer(savedTask);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

// EDIT USERSTORY/ SPRINT/ TASK

router.post("/edit-userstory", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }

    // If no such project found
    if(!project.userStories.includes(req.body.userStory.id)) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το user story.' });
    }
    const userStory = await UserStory.findById(req.body.userStory.id);
    // Check if user is authorized for that action
    const user = req.user;
    if (!project.userStories.includes(userStory._id) && project.productOwner !== user._id) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }
    
    if (req.body.userStory.status == 'done' && req.body.userStory.status != userStory.status) {
      req.body.userStory.endingDate = Date.now();
    }
    delete req.body.userStory.tasks
    delete req.body.userStory.sprints
    const updatedUserStory = await UserStory.findByIdAndUpdate(req.body.userStory.id, req.body.userStory, { runValidators: true, new: true });

    context = userStorySerializer(updatedUserStory);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

router.post("/edit-sprint", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }
    // If no such sprint found
    if(!project.sprints.includes(req.body.sprint.id)) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το sprint.' });
    }
    const sprint = await Sprint.findById(req.body.sprint.id);
    // Check if user is authorized for that action
    const user = req.user;
    if (!project.userStories.includes(sprint._id) && project.productOwner !== user._id) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }
    
    if (req.body.sprint.status == 'done' && req.body.sprint.status != sprint.status) {
      req.body.sprint.endingDate = Date.now();
    }
    delete req.body.sprint.tasks
    const updatedSprint = await Sprint.findByIdAndUpdate(req.body.sprint.id, req.body.sprint, { runValidators: true, new: true });

    context = sprintSerializer(updatedSprint);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

router.post("/edit-task", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }
    // If no such task found
    if(!project.tasks.includes(req.body.task.id)) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το task.' });
    }
    const task = await Task.findById(req.body.task.id);
    // Check if user is authorized for that action
    const user = req.user;
    if (!project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }
    
    if (req.body.task.status == 'done' && req.body.task.status != task.status) {
      req.body.task.endingDate = Date.now();
    }

    if (req.body.sprint && req.body.sprint !== task.sprint) {
      const sprint = await Sprint.findById(req.body.sprint);
      // If no such userStory found
      if(!sprint) {
        return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το sprint.' });
      }
    }
    if (req.body.userStory && req.body.userStory !== task.userStory) {
      const userStory = await UserStory.findById(req.body.userStory);
      // If no such userStory found
      if(!userStory) {
        return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το userStory.' });
      }
    }
    delete req.body.task.members;
    const updatedTask = await Task.findByIdAndUpdate(req.body.task.id, req.body.task, { runValidators: true, new: true });

    context = taskSerializer(updatedTask);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

// DELETE USERSTORY/ SPRINT/ TASK

router.post("/delete-userstory", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }
    // If no such userStory found
    if(!project.userStories.includes(req.body.userStoryID)) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το user story.' });
    }
    const userStory = await UserStory.findById(req.body.userStoryID);
    // Check if user is authorized for that action
    const user = req.user;
    if (project.productOwner !== user._id) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    project.userStories = project.userStories.filter((usID) => { return usID !== userStory._id });

    let task, sprint
    for (let i in userStory.tasks) {
      task = await Task.findById(userStory.tasks[i]._id);
      sprint = await Sprint.findById(userStory.tasks[i].sprint);
      sprint.tasks = sprint.tasks.filter((tID) => { return tID !== task._id });
      await Sprint.findByIdAndUpdate(sprint._id, sprint, { runValidators: true, new: true });
      await Task.deleteOne({ _id: task._id });
    }

    // Remobe sprint from its table
    const removedUserStory = await UserStory.deleteOne({ _id: userStory._id });

    const context = userStorySerializer(removedUserStory);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

router.post("/delete-sprint", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }
    // If no such sprint found
    if(!project.sprints.includes(req.body.sprintID)) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το sprint.' });
    }
    const sprint = await Task.findById(req.body.sprintID);
    // Check if user is authorized for that action
    const user = req.user;
    if (project.productOwner !== user._id) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    project.sprints = project.sprints.filter((sID) => { return sID !== sprint._id });

    let userStory
    for (let i in project.userStories) {
      userStory = await UserStory.findById(project.userStories[i]._id);
      userStory.sprints = userStory.sprints.filter((sID) => { return sID !== sprint._id });
      await UserStory.findByIdAndUpdate(userStory._id, userStory, { runValidators: true, new: true });
    }

    let task
    for (let i in sprint.tasks) {
      task = await UserStory.findById(sprints.tasks[i]._id);
      task.sprint = null
      await Task.findByIdAndUpdate(task._id, task, { runValidators: true, new: true });
    }

    // Remobe sprint from its table
    const removedSprint = await Task.deleteOne({ _id: sprint._id });

    const context = taskSerializer(removedSprint);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

router.post("/delete-task", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }
    // If no such task found
    if(!project.tasks.includes(req.body.taskID)) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το task.' });
    }
    const task = await Task.findById(req.body.taskID);
    // Check if user is authorized for that action
    const user = req.user;
    if (!project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    if (task.sprint) {
      const sprint = await Sprint.findById(task.sprint._id);
      // Remove task from user's tasks list
      sprint.tasks = sprint.tasks.filter((tID) => { return tID !== task._id });

      // Update user's info
      await Sprint.findByIdAndUpdate(sprint._id, sprint, { runValidators: true, new: true });
    }
    if (task.userStory) {
      const userStory = await UserStory.findById(task.userStory._id);
      // Remove task from user's tasks list
      userStory.tasks = userStory.tasks.filter((tID) => { return tID !== task._id });

      // Update user's info
      await UserStory.findByIdAndUpdate(userStory._id, userStory, { runValidators: true, new: true });
    }

    // Remobe task from its table
    const removedTask = await Task.deleteOne({ _id: task._id });

    const context = taskSerializer(removedTask);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

router.post("/join-task", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }
    // If no such task found
    if(!project.tasks.includes(req.body.taskID)) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το task.' });
    }
    const task = await Task.findById(req.body.taskID);
    // Check if user is authorized for that action
    const user = req.user;
    if (!project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    if (!task.members.includes(user._id)) {
      task.members.push(user._id)
    }
    const updatedTask = await Task.findByIdAndUpdate(task._id, task, { runValidators: true, new: true });

    context = taskSerializer(updatedTask);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

router.post("/leave-task", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }
    // If no such task found
    if(!project.tasks.includes(req.body.taskID)) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το task.' });
    }
    const task = await Task.findById(req.body.taskID);
    // Check if user is authorized for that action
    const user = req.user;
    if (!project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    if (task.members.includes(user._id)) {
      task.members = task.members.filter((mID) => { mID !== user._id });
    }
    const updatedTask = await Task.findByIdAndUpdate(task._id, task, { runValidators: true, new: true });

    context = taskSerializer(updatedTask);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})

router.post("/leave-project", async (req, res) => {
  try {
    const project = await Project.findById(req.body.projectID);
    // If no such project found
    if(!project) {
      return res.status(400).json({ message: 'Σφάλμα: Δε βρέθηκε το project.' });
    }
    // Check if user is authorized for that action
    const user = req.user;
    if (project.productOwner === user._id) { // && !project.members.includes(user._id)) {
      return res.status(400).json({ message: 'Σφάλμα: Ο χρήστης δεν έχει δικαίωμα να προβεί σε αυτή την ενέργεια.' });
    }

    if (project.members.includes(user._id)) {
      project.members = project.members.filter((mID) => { mID !== user._id });

      if (project.scrumMaster === user._id) {
        project.scrumMaster = project.productOwner
      }
    }
    const updatedProject = await Project.findByIdAndUpdate(project._id, project, { runValidators: true, new: true });

    context = projectDetailSerializer(updatedProject);
    res.json(context);
  } catch (error) {
    res.status(400).json({ message: error });
  }
})


// Export router
module.exports = router;