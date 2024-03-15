// use zod to validate input

import { NextApiRequest, NextApiResponse } from "next";
import { ZodSchema } from "zod";

export const withInputValidation = (
	schema: ZodSchema<any>,
	handler: (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>,
	ctx?: { req: NextApiRequest; res: NextApiResponse }
) => {
	if (!ctx) {
		return async (req: NextApiRequest, res: NextApiResponse) => {
			return withInputValidation(schema, handler, { req, res });
		};
	}

	const { req, res } = ctx;
	try {
		schema.parse(req.body);
		return handler(req, res);
	} catch (err: any) {
		return res
			.status(400)
			.json({ data: `${err.issues[0].path} - ${err.issues[0].message}` });
	}
};

export const validateInput = (schema: ZodSchema<any>, input: any) => {
	try {
		schema.parse(input);
	} catch (error: any) {
		throw {
			// message is used in next auth
			message: `${error.issues[0].path} - ${error.issues[0].message}`,
			status: 400,
		};
	}
};
