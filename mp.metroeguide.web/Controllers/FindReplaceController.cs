
using Microsoft.AspNetCore.Mvc;

namespace mp.metroeguide.web.Controllers
{
    public class FindReplaceController : Controller
    {
        // GET: FindReplace
        public ActionResult Index()
        {
            ViewBag.ActivePage = "findReplace";
            return View();
        }
    }
}