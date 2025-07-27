const Issue = require('../models/Issue');

// @desc Create an issue
exports.createIssue = async (req, res) => {
  const { title, description, imageUrl, location, zone } = req.body;

  try {
    const issue = await Issue.create({
      title,
      description,
      imageUrl,
      location,
      zone,
      createdBy: req.user.id,
    });
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all issues
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate('createdBy', 'name email').populate('zone');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update issue status (admin only)
exports.updateIssueStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = status;
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
