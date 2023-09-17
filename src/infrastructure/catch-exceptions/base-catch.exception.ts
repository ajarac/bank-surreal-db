import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export abstract class BaseCatchException implements ExceptionFilter {
	protected constructor(private readonly httpStatus: HttpStatus) {}

	catch(exception: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		response.status(this.httpStatus).send({
			statusCode: this.httpStatus,
			message: exception.message,
		});
	}
}
