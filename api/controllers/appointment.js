var Model = require("../models/index");
const {Appointment,Slot } = Model;
const Nexmo = require("nexmo");

const appointmentController = {
  all(req, res){
    //Returns All appointments
    Appointment.find({}).exec((err, appointments) => res.json(appointments));
  },
    create(req,res) {
      var requestBody = req.body;

      var newslot = new Slot({
        slot_time: requestBody.slot_time,
        slot_date: requestBody.slot_date,
        created_at: Date.now()
      });

      newslot.save();

      //Get locations
      var locations = []
      console.log(requestBody.locations)
      requestBody.locations.forEach(
        function(x){
          locations.push(x.formatted_address)
        }
      )
      //Creates a new record from a submitted form
      var newappointment = new Appointment({
        name: requestBody.name,
        email: requestBody.email,
        phone: requestBody.phone,
        description: requestBody.description,
        location: locations,
        slots: newslot._id
      });

      const nexmo = new Nexmo({
        apiKey: "790fd441",
        apiSecret: "ccHcuNNFEm12yKss"
      })

      let msg =
        requestBody.name +
        " " +
        "this message is to confirm your appointment on " +
        requestBody.slot_date +
        ", "+
        requestBody.slot_time+
        " at "+
        locations[0];

      newappointment.save((err, saved) => {

        Appointment.find({_id: saved._id})
          .populate("slots")
          .exec((err,appointment) => res.json(appointment));

        const from = 12017785318;
        const to = "1"+requestBody.phone;

        nexmo.message.sendSms(from, to, msg, (err, responseData) => {
          if(err) {
            console.log(err);
          } else {
            console.dir(responseData);
          }
        });
      });
    }
};

module.exports = appointmentController;
