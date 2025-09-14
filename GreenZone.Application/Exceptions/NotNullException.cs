using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Application.Exceptions
{
    public class NotNullException : Exception
    {
        public NotNullException(string message) : base(message)
        {
        }

        public NotNullException(string message, Exception innerException) : base(message, innerException)
        {
        }

        public NotNullException() : base("Can not be Null")
        {
        }
    }
}
