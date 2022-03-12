using Microsoft.AspNetCore.Mvc;

namespace mp.metroeguide.web.Controllers
{
    public class LinkViewerController : Controller
    {
        // GET: LinkViewer
        public ActionResult Index(int? id)
        {
            if(id != null)
            {
                ViewBag.PageId = id;
            }


            ViewBag.ActivePage = "linkViewer";

            return View();
        }
    }
}