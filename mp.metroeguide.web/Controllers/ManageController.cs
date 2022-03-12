using Microsoft.AspNetCore.Mvc;

namespace mp.metroeguide.web.Controllers
{
    public class ManageController : Controller
    {
        // GET: Manage
        public ActionResult Index()
        {
            ViewBag.ActivePage = "manage";
            return View();
        }

        public ActionResult Page(int id)
        {
            ViewBag.ActivePage = "manage";
            ViewBag.PageId = id;

            return View();
        }

    }
}
