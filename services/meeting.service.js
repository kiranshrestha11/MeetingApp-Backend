const { meeting } = require("../model/meeting.model");
const { meetingUser } = require("../model/meeting-user.model");

async function getAllMeetingUser(meetId, callBack) {
  meetingUser
    .find({ meetingId: meetId })
    .then((response) => {
      return callBack(null, response);
    })
    .catch((error) => {
      return callBack(error);
    });
}

async function startMeeting(params, callBack) {
  const meetingSchema = new meeting(params);

  meetingSchema
    .save()
    .then((response) => {
      return callBack(null.response);
    })
    .catch((error) => {
      return callBack(error);
    });
}

async function joinMeeting(params, callBack) {
  const meetingUserModel = new meetingUser(params);

  meetingUserModel
    .save()
    .then(async (response) => {
      await meeting.findOneAndUpdate(
        { id: params.meetingId },
        { $addToSet: { meetingUsers: meetingUserModel } }
      );
      return callBack(null, response);
    })
    .catch((error) => {
      return callBack(error);
    });
}

async function isMeetingPresent(meetingId, callBack) {
  meeting
    .findById(meetingId)
    .populate("meetingUsers", "MeetingUser")
    .then((response) => {
      if (!response) callBack("Invalid Meeting Id");
      else callBack(null, true);
    })
    .catch((error) => {
      return callBack(error, false);
    });
}

async function checkMeetingExists(meetingId, callBack) {
  meeting
    .findById(meetingId, "hostId,hostName,startTime")
    .populate("meetingUsers", "MeetingUser")
    .then((response) => {
      if (!response) callBack("Invalid Meeting Id");
      else callBack(null, response);
    })
    .catch((error) => {
      return callBack(error, false);
    });
}

async function getMeetingUser(params, callBack) {
  const { meetingId, userId } = params;

  meetingUser
    .find({ meetingId, userId })
    .then((response) => {
      return callBack(null, response[0]);
    })
    .catch((error) => {
      return callBack(error);
    });
}

async function updateMeetingUser(params, callBack) {
  meetingUser
    .updateOne({ userId: params.userId }, { $set: params }, { new: true })
    .then((response) => {
      return callBack(null, response);
    })
    .catch((error) => {
      return callBack(error);
    });
}

async function getUserBySocketId(params, callBack) {
  const { meetingId, SocketId } = params;

  meetingUser
    .find({ meetingId, SocketId })
    .limit(1)
    .then((response) => {
      return callBack(null, response);
    })
    .catch((error) => {
      return callBack(error);
    });
}

module.exports = {
  startMeeting,
  joinMeeting,
  getAllMeetingUser,
  isMeetingPresent,
  checkMeetingExists,
  getUserBySocketId,
  updateMeetingUser,
  getMeetingUser,
};
