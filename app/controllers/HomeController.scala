package controllers

import de.htwg.se.zombiezite
import de.htwg.se.zombiezite.ZombieZiteApp
import javax.inject._
import play.api.mvc._


/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val c: zombiezite.controller.ControllerInterface = ZombieZiteApp.getController()

  def about() = Action { implicit request: Request[AnyContent] =>
    c.init(2)
    Ok(views.html.About())
  }

  def index() = Action { implicit request: Request[AnyContent] =>
    c.init(4)
    Ok(views.html.index(c))
  }

  def newGame() = Action { implicit request: Request[AnyContent] =>
    c.init(2)
    Ok(views.html.index(c))
  }
}

