using Microsoft.AspNetCore.Mvc;

namespace mp.metroeguide.web.Controllers
{
    public class BulkInsertController : Controller
    {
        // GET: BulkInsert
        public ActionResult Index()
        {
            ViewBag.ActivePage = "bulk";
            return View();
        }
    }
}
