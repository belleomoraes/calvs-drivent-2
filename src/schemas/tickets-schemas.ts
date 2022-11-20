import Joi from "joi";

export const createTicketTypeSchema = Joi.object({
  ticketTypeId: Joi.number().required(),
});
