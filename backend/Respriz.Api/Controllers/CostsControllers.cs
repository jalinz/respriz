
using Microsoft.AspNetCore.Mvc;
using Respriz.Api.Models;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class CostsController : ControllerBase
{
    private static readonly List<Cost> Costs = new List<Cost>();

    [HttpGet]
    public IActionResult GetCosts()
    {
        return Ok(Costs);
    }

    [HttpPost]
    public IActionResult AddCost([FromBody] Cost cost)
    {
        Costs.Add(cost);
        return CreatedAtAction(nameof(GetCosts), new { id = cost.Id }, cost);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteCost(int id)
    {
        var cost = Costs.FirstOrDefault(c => c.Id == id);
        if (cost == null)
        {
            return NotFound();
        }
        Costs.Remove(cost);
        return NoContent();
    }
}
