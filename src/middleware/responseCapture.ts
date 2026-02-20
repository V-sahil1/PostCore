import type { Request, Response, NextFunction } from "express";

export const captureResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const oldJson = res.json;

  // console.log(res.locals.responseBody);

  res.locals.responseBody = null;
  //   console.log(res.locals.responseBody);

  res.json = function (body: string) {
    res.locals.responseBody = body;
    // console.log(body);
    return oldJson.call(this, body);
  };

  next();
};

//change
