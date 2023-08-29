using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.Generic;
using System.Linq;

namespace WebCAP.CustomFilter
{
    public class ValidationResultModel
    {
        public string Message { get; }
        public List<ValidationError> Errors { get; }
        public ValidationResultModel(ModelStateDictionary modelState)
        {
            Message = "Validation Failed";
            Errors = modelState.Keys
                    .SelectMany(key => modelState[key].Errors.Select(x => new ValidationError(key, !string.IsNullOrEmpty(x.ErrorMessage) ? x.ErrorMessage : x.Exception.Message)))
                    .ToList();
        }
    }
}
