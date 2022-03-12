using Microsoft.AspNetCore.Mvc;

namespace mp.metroeguide.web.Controllers
{
    public class ClientsController : Controller
    {
        // GET: Clients
        public ActionResult Index()
        {
            ViewBag.ActivePage = "clients"; 
            return View();
        }
    }
}
