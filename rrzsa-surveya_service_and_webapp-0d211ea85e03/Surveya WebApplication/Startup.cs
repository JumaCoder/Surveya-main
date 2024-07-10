using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Surveya_Application.Startup))]
namespace Surveya_Application
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            //ConfigureAuth(app);
        }
    }
}
