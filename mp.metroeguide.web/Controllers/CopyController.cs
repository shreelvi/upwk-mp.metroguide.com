using Microsoft.AspNetCore.Mvc;

namespace mp.metroeguide.web.Controllers
{
    public class CopyController : Controller
    {
        // GET: Copy
        public ActionResult Index()
        {
            ViewBag.ActivePage = "copy";
            return View();
        }
    }
}
