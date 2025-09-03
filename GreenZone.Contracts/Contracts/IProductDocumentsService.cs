using GreenZone.Contracts.Dtos.ProductDocumentsDto;
using GreenZone.Contracts.Service;
using GreenZone.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenZone.Contracts.Contracts
{
    public interface IProductDocumentsService : IGenericService<ProductDocuments, ProductDocumentsCreateDto,ProductDocumentsReadDto, ProductDocumentsUpdateDto>
    {
    }
}
