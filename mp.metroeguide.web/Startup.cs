using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace mp.metroeguide.web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.AddWebOptimizer(pipeline => 
            {
                //CSS
                pipeline.AddCssBundle("/css/bundle.css", 
                    "css/site.css", "css/bootstrap.css", "css/toastr.min.css");

                //JS
                pipeline.AddJavaScriptBundle("/js/bundles/jquery.js", 
                    "js/scripts/vendor/jquery-1.10.2.js");

                pipeline.AddJavaScriptBundle("/js/bundles/bootstrap.js", 
                    "js/scripts/vendor/bootstrap.js", 
                    "js/scripts/vendor/respond.js");

                pipeline.AddJavaScriptBundle("/js/bundles/knockout.js", 
                    "js/scripts/vendor/knockout-3.3.0.js", 
                    "js/scripts/koHandlers/showModal.js", 
                    "js/scripts/vendor/pager.min.js", 
                    "js/scripts/vendor/moment.js", 
                    "js/scripts/vendor/toastr.min.js");

                pipeline.AddJavaScriptBundle("/js/bundles/site.js", 
                    "js/scripts/dataService.js", 
                    "js/scripts/reusables/foldersList.js");

                pipeline.AddJavaScriptBundle("/js/bundles/clientManager.js", 
                    "js/scripts/clientManager/models.js",
                    "js/scripts/clientManager/clientVm.js");

                pipeline.AddJavaScriptBundle("/js/bundles/pageCopier.js", 
                    "js/scripts/copy/models.js", 
                    "js/scripts/copy/copyVm.js");

                pipeline.AddJavaScriptBundle("/js/bundles/manage.js", 
                    "js/scripts/reusables/foldersList.js",
                    "js/scripts/manage/models.js", 
                    "js/scripts/manage/manageVm.js");
                
                pipeline.AddJavaScriptBundle("/js/bundles/pageManage.js", 
                    "js/scripts/pageManage/models.js",
                    "js/scripts/pageManage/pageManageVm.js");

                pipeline.AddJavaScriptBundle("js/bundles/linkViewer.js", 
                    "js/scripts/koHandlers/iFrameBinder.js",
                    "js/scripts/models/LinkModel.js", 
                    "js/scripts/linkViewer/linkViewerVm.js");

                pipeline.AddJavaScriptBundle("js/bundles/findReplace.js", 
                    "js/scripts/findReplace/findReplaceVm.js");

                pipeline.AddJavaScriptBundle("js/bundles/linkChecker.js", 
                    "js/scripts/koHandlers/img.js", 
                    "js/scripts/linkChecker/models.js",
                    "js/scripts/linkChecker/linkCheckerVm.js");
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseWebOptimizer();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
