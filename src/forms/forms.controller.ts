import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import { FormsService } from './forms.service';
import {ApiTags} from "@nestjs/swagger";

@Controller('forms')
@ApiTags('Forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {
  }

  @Get()
  getAllForms() {
    return this.formsService.getAllForms()
  }

  @Get(':formId')
  getFormById(
      @Param("formId", ParseIntPipe) formId: number
  ) {
    return this.formsService.getFormById(formId);
  }
}